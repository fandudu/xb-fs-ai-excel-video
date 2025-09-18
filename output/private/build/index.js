"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 自己的业务
const domain = "aibeings-vip.xiaoice.com";
const baseUrl = `http://${domain}`;
const errorMsgPng = "https://commercial-public-static-resource.oss-cn-beijing.aliyuncs.com/digital-human-resource/build/character-ip/character-assets/images/errorMsg.png?t=" +
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
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList([domain]);
block_basekit_server_api_1.basekit.addField({
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            "zh-CN": {
                szrfwkey: "数字人服务key",
                keyHolder: "请联系：15623339073 获取subkey",
                noMatchId: "无效的数字演员ID，请联系对接人获取",
                szryyid: "数字演员",
                spzt: "视频主题",
                kbwa: "口播文案",
                cpt: "产品图",
            },
            "en-US": {
                szrfwkey: "Digital Human Service Key",
                keyHolder: "Please contact: 15623339073 to obtain the subkey",
                undefinedId: "Invalid Digital Actor ID, please contact the connector to obtain",
                szryyid: "Digital Actor ID",
                spzt: "Video Theme",
                kbwa: "Script",
                cpt: "Product Image",
            },
            "ja-JP": {
                szrfwkey: "デジタルヒューマンサービスキー",
                keyHolder: "接続者に連絡してsubkeyを取得してください：15623339073",
                undefinedId: "無効なデジタルアクターID、接続者に連絡して取得してください",
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
            component: block_basekit_server_api_1.FieldComponent.Input,
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
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
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
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: true,
            },
        },
        {
            key: "content",
            label: t("kbwa"),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text],
            },
            validator: {
                required: false,
            },
        },
        {
            key: "imageUrl",
            label: t("cpt"),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: false,
            },
        },
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Text,
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
    execute: async (formItemParams, context) => {
        console.log("formItemParams:", formItemParams);
        const { vhBizId, topic, content, imageUrl, subKey } = formItemParams;
        try {
            // 校验必填参数
            if (!vhBizId.value || !topic) {
                console.log("缺少必填参数", vhBizId.value, topic);
                return { code: block_basekit_server_api_1.FieldCode.InvalidArgument, data: "" };
            }
            let params = {
                content: content ? content[0].text : "", // 口播文案
                topic: topic ? topic[0].text : "", // 视频主题
                vhBizId: vhBizId.value, // 数字人id
                materialList: imageUrl?.map((item) => {
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
            const response = await context
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
                let timerRef = null;
                return new Promise((resolve) => {
                    let waitTime = 0; // 等待时间，单位为毫秒
                    timerRef = setInterval(async () => {
                        waitTime += 5000;
                        const response2 = await context.fetch(`${baseUrl}/openapi/aivideo/detail/${response.data}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "subscription-key": subKey, // subkey
                            },
                        });
                        const data2 = await response2.json();
                        if (data2.data?.outputData?.videoUrl) {
                            clearInterval(timerRef);
                            timerRef = null;
                            console.log("API2 返回结果:", data2);
                            resolve({
                                code: block_basekit_server_api_1.FieldCode.Success,
                                data: data2.data?.outputData?.videoUrl,
                            });
                        }
                        else {
                            console.log("等待视频生成,时间：", waitTime / 1000, "s");
                        }
                    }, 5000);
                });
            }
            else {
                console.log("请求失败:", response.message);
                return {
                    code: block_basekit_server_api_1.FieldCode.Error,
                    data: response.message,
                };
            }
        }
        catch (error) {
            console.log("请求出错:", String(error));
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
                data: String(error),
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFPOEM7QUFDOUMsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFDcEIsUUFBUTtBQUNSLE1BQU0sTUFBTSxHQUFHLDBCQUEwQixDQUFDO0FBQzFDLE1BQU0sT0FBTyxHQUFHLFVBQVUsTUFBTSxFQUFFLENBQUM7QUFDbkMsTUFBTSxXQUFXLEdBQ2YseUpBQXlKO0lBQ3pKLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFFdkIsTUFBTSxRQUFRLEdBQUc7SUFDZixXQUFXLEVBQUUsaUJBQWlCO0lBQzlCLFFBQVEsRUFBRSxpQkFBaUI7SUFDM0IsV0FBVyxFQUFFLGlCQUFpQjtJQUM5QixTQUFTLEVBQUUsaUJBQWlCO0lBQzVCLFNBQVMsRUFBRSxpQkFBaUI7SUFDNUIsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixTQUFTLEVBQUUsaUJBQWlCO0lBQzVCLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsU0FBUyxFQUFFLGlCQUFpQjtJQUM1QixVQUFVLEVBQUUsaUJBQWlCO0NBQzlCLENBQUM7QUFFRixNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RCxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUNwQixLQUFLLEVBQUUsR0FBRztDQUNYLENBQUMsQ0FBQyxDQUFDO0FBcUJKLDJCQUEyQjtBQUMzQixrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDaEMsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixnQkFBZ0I7SUFDaEIsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dC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