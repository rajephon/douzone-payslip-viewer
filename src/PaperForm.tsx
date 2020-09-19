import React from 'react';
import {Form, Button, Upload, Input} from 'antd';
import {UploadFile, UploadChangeParam, RcCustomRequestOptions} from "antd/es/upload/interface";

import {InboxOutlined} from '@ant-design/icons';

const layout = {
    xs: {span: 24},
    sm: {span: 24},
    md: {span: 24},
    lg: {span: 24}
};

const PaperForm = ({onSubmit}: { onSubmit: (content: string, key: string) => void }) => {
    const [fileError, setFileError] = React.useState<boolean>(false);
    const [keyError, setKeyError] = React.useState<boolean>(false);

    const [content, setContent] = React.useState<string>("")
    const [uploadFile, setUploadFile] = React.useState<UploadFile | undefined>(undefined);
    const [key, setKey] = React.useState<string>("");

    const onUpload = (options: RcCustomRequestOptions) => {
        if (options.file.name.length < 4 || options.file.name.slice(-4) !== ".htm") {
            setFileError(true);
            setUploadFile(undefined);
            return;
        }
        let fileReader = new FileReader();
        fileReader.onload = () => {
            setContent(fileReader.result as string);
            setFileError(false);

            options.onSuccess({}, options.file);

        };
        fileReader.onerror = () => {
            setFileError(true);

            options.onError(new Error(), {}, options.file);
        }
        fileReader.readAsText(options.file);
    }

    const onUploadChange = (info: UploadChangeParam) => {
        if (info.file.status === "done") {
            setUploadFile(info.file);
        }
    };

    const onClickSubmit = () => {
        if (content === "") {
            setFileError(true);
            return;
        }
        if (isNaN(parseInt(key))) {
            setKeyError(true);
            return;
        }
        setKeyError(false);
        onSubmit(content, key);
    }

    return (
        <Form layout="vertical" labelCol={layout} wrapperCol={layout}>
            <Form.Item label={'급여명세서'} validateStatus={fileError ? "error" : undefined}
                       help={fileError ? "파일 불러오기에 실패했습니다." : undefined} required>
                <Form.Item name="paper" noStyle valuePropName={'filelist'}>
                    <Upload.Dragger name="files" multiple={false}
                                    showUploadList={{showDownloadIcon: false, showRemoveIcon: false}}
                                    action={''} customRequest={onUpload}
                                    fileList={uploadFile !== undefined ? [uploadFile] : []}
                                    onChange={onUploadChange}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">급여명세서 .htm 파일을 선택해주세요</p>
                        <p className="ant-upload-hint">드래그 앤 드랍 가능</p>
                    </Upload.Dragger>
                </Form.Item>
            </Form.Item>
            <Form.Item label="주민등록번호 뒤 7자리" validateStatus={keyError ? "error" : undefined}
                       help={keyError ? "올바른 값을 입력해주세요." : undefined} required>
                <Input.Password placeholder="*******" value={key} onChange={(e) => {
                    setKey(e.currentTarget.value)
                }}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" onClick={onClickSubmit}>
                    확인
                </Button>
            </Form.Item>
        </Form>
    );
}

export default PaperForm;
