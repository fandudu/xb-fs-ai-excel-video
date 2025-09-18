import {
  basekit,
  FieldType,
  field,
  FieldCode,
  FieldComponent,
  AuthorizationType,
} from "@lark-opdev/block-basekit-server-api";
const { t } = field;
// 自己的业务
const domain = "aibeings-vip.xiaoice.com";
const baseUrl = `http://${domain}`;
const errorMsgPng =
  "https://commercial-public-static-resource.oss-cn-beijing.aliyuncs.com/digital-human-resource/build/character-ip/character-assets/images/errorMsg.png?t=" +
  new Date().getTime();

const vhBizIds = {
  "张淑芬-大健康博主": "VHPUBJB6TBUCMUE",
  "静怡-女主播": "VHP3HOLVRPL9QYR",
  "文泽-科技产品种草": "VHPWHEUD6XTHZ5J",
  "冰冰-快消博主": "VHPHTWFSQSGASD4",
  "思悦-课程顾问": "VHPAPKRSKCGGCBU",
  "安娜-外语": "VHPHBRWKCZ2EDRS",
  "程也-美业博主": "VHPPKQW5VLGEQ6Q",
  "黎舒-护士": "VHPRDCRU619GBNC",
  "李白-古代名人": "VHPRTSSPRX2UZNQ",
  "可怡-带货女主播": "VHPD1KKPLNOJCF8",
};

const vhBizIdOptions = Object.keys(vhBizIds).map((key) => ({
  value: vhBizIds[key],
  label: key,
}));

interface Response {
  code: number;
  message: string;
  traceId: string;
}
interface IAttachment {
  name: string;
  size: number;
  type: string;
  tmp_url: string;
}
interface IInput {
  text: string;
  type: "text";
}
interface CreateResponse extends Response {
  data: string;
}

// 通过addDomainList添加请求接口的域名
basekit.addDomainList([domain]);
basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      "zh-CN": {
        szrfwkey: "数字人服务key",
        keyHolder: "请联系对接人获取subkey",
        noMatchId: "无效的数字演员ID，请联系对接人获取",
        szryyid: "数字演员",
        spzt: "视频主题",
        kbwa: "口播文案",
        cpt: "产品图",
      },
      "en-US": {
        szrfwkey: "Digital Human Service Key",
        keyHolder: "Please contact the connector to obtain the subkey",
        undefinedId:
          "Invalid Digital Actor ID, please contact the connector to obtain",
        szryyid: "Digital Actor ID",
        spzt: "Video Theme",
        kbwa: "Script",
        cpt: "Product Image",
      },
      "ja-JP": {
        szrfwkey: "デジタルヒューマンサービスキー",
        keyHolder: "接続者に連絡してサブキーを取得してください",
        undefinedId:
          "無効なデジタルアクターID、接続者に連絡して取得してください",
        szryyid: "デジタルアクターID",
        spzt: "ビデオテーマ",
        kbwa: "スクリプト",
        cpt: "製品画像",
      },
    },
  },
  // 定义捷径的入参
  formItems: [
    {
      key: "subKey",
      label: t("szrfwkey"),
      component: FieldComponent.Input,
      props: {
        placeholder: t("keyHolder"),
      },
      validator: {
        required: true,
      },
    },
    {
      key: "vhBizId",
      label: t("szryyid"),
      component: FieldComponent.SingleSelect,
      props: {
        options: vhBizIdOptions,
      },
      validator: {
        required: true,
      },
    },
    {
      key: "topic",
      label: t("spzt"),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
      },
      validator: {
        required: false,
      },
    },
    {
      key: "content",
      label: t("kbwa"),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
      },
      validator: {
        required: true,
      },
    },
    {
      key: "imageUrl",
      label: t("cpt"),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: false,
      },
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Text,
  },
  // authorizations: [
  //   {
  //     id: "xb_fs_ai_excel_video", // 授权的id，用于context.fetch第三个参数指定使用
  //     platform: "baidu", // 授权平台，目前可以填写当前平台名称
  //     type: AuthorizationType.MultiHeaderToken, // 授权类型
  //     // 用户可以填写的key
  //     params: [{ key: "subscription-key", placeholder: t("keyHolder") }],
  //     required: true, // 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息
  //     label: t("szrfwkey"), // 授权平台，告知用户填写哪个平台的信息
  //     icon: {
  //       light: "",
  //       dark: "",
  //     },
  //     instructionsUrl: "",
  //   },
  // ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (
    formItemParams: {
      vhBizId: {
        label: string;
        value: string;
      };
      subKey: string;
      topic: IInput[];
      content: IInput[];
      imageUrl: IAttachment[];
    },
    context
  ) => {
    console.log("formItemParams:", formItemParams);
    const { vhBizId, topic, content, imageUrl, subKey } = formItemParams;
    try {
      // 校验必填参数
      if (!vhBizId.value || !content) {
        console.log("缺少必填参数", vhBizId.value, content);
        return { code: FieldCode.InvalidArgument, data: "" };
      }
      let params = {
        content: content[0].text, // 口播文案
        topic: topic ? topic[0].text : "", // 视频主题
        vhBizId: vhBizId.value, // 数字人id
        materialList:
          imageUrl?.map((item: any) => {
            return {
              url: item.tmp_url,
            };
          }) || [], // 产品图
      };
      console.log("API1 请求参数:", params);
      // return {
      //   code: FieldCode.Success,
      //   data: "https://virtualman.oss-cn-beijing.aliyuncs.com/avatar_editor/d89fe6d3-88a3-11f0-9acd-2bd9d71f7e2f/4cac1d2.thumbnail.mp4",
      // };
      const response: CreateResponse = await context
        .fetch(`${baseUrl}/openapi/aivideo/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "subscription-key": subKey, // subkey
          },
          body: JSON.stringify(params),
        })
        .then((res) => res.json());
      console.log("API1 返回结果:", response);
      if (response.data) {
        let timerRef: NodeJS.Timeout | null = null;
        return new Promise((resolve) => {
          let waitTime = 0; // 等待时间，单位为毫秒
          timerRef = setInterval(async () => {
            waitTime += 5000;
            const response2 = await context.fetch(
              `${baseUrl}/openapi/aivideo/detail/${response.data}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "subscription-key": subKey, // subkey
                },
              }
            );
            const data2: any = await response2.json();
            if (data2.data?.outputData?.videoUrl) {
              clearInterval(timerRef);
              timerRef = null;
              console.log("API2 返回结果:", data2);
              resolve({
                code: FieldCode.Success,
                data: data2.data?.outputData?.videoUrl,
              });
            } else {
              console.log("等待视频生成,时间：", waitTime / 1000, "s");
            }
          }, 5000);
        });
      } else {
        console.log("请求失败:", response.message);
        return {
          code: FieldCode.Error,
          data: response.message,
        };
      }
    } catch (error) {
      console.log("请求出错:", String(error));
      return {
        code: FieldCode.Error,
        data: String(error),
      };
    }
  },
});
export default basekit;
