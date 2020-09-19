import React from 'react';
import {Row, Col, Typography, Divider} from 'antd';
import 'antd/dist/antd.css';
import PaperForm from "./PaperForm";
import {Decryptor} from "./lib/decryptor";
import {GithubOutlined} from "@ant-design/icons";

const cheerio = require('cheerio');
const {Title, Paragraph} = Typography;


const layout = {
    xs: {span: 24},
    sm: {span: 22, offset: 1},
    md: {span: 20, offset: 2},
    lg: {span: 18, offset: 3}
}

function App() {
    const [decryptedPaper, setDecryptedPaper] = React.useState<string>("");
    const onSubmit = (content: string, key: string) => {
        const $ = cheerio.load(content);
        const data = $('#frm input[type="hidden"]').val();
        if (typeof data === 'undefined') {
            console.error('죄송합니다. 복호화에 실패했습니다.');
            return;
        }
        const result = Decryptor.decrypt(data, key);
        if (result.slice(0, 5) !== "<html") {
            console.error('복호화 실패');
            return;
        }
        setDecryptedPaper(result);
        console.log(result);
    }

    return (
        <>
            <Row>
                <Col {...layout} >
                    <Typography>
                        <Title>더존 급여명세서 뷰어</Title>
                    </Typography>
                    <Divider/>
                    <PaperForm onSubmit={onSubmit}/>
                    <Divider/>
                </Col>
            </Row>
            <Row>
                {decryptedPaper && <Col {...layout}>
                    <iframe title={'view'} srcDoc={decryptedPaper} style={{display: 'block', width: '100%', height: '100vh'}}/>
                </Col>}
            </Row>
            <Row>
                <Col {...layout} >
                    <Typography>
                        <Paragraph>
                            트래픽 분석을 위한 <a href="https://www.google.com/analytics/web/">구글 애널리틱스</a> 기본 페이지 접속 정보 수집 외 <strong>급여명세서, 주민등록번호를 포함한 그 어떠한 정보도 수집하지 않으며, 또한 서버로 전송하지 않습니다.</strong> 모든 복호화 처리는 로컬에서 이루어집니다.
                        </Paragraph>
                        Developed by <a href="https://rajephon.dev">rajephon</a> / <a href="https://github.com/rajephon/douzone-salary-certificate-viewer">깃허브 <GithubOutlined /></a> / <a href="https://github.com/rajephon/douzone-salary-certificate-viewer/issues">버그 리포트</a>
                    </Typography>
                </Col>
            </Row>
        </>
    );
}

export default App;
