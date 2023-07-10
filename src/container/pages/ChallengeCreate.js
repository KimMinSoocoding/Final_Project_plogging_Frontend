import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Col, Row, DatePicker, message, Checkbox, Space } from "antd";
import propTypes from 'prop-types';
import Dragger from 'antd/lib/upload/Dragger';
import { Button } from '../../components/buttons/buttons';
import { Modal } from '../../components/modals/antd-modals';
import { BasicFormWrapper } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';
import { getItem } from "../../utility/localStorageControl";
import dayjs from "dayjs";
import '../../static/css/ChallengeDetail.css';

"dayjs";

const { Option } = Select;

function Redirect() {
  return null;
}

function ChallengeCreate({ visible, onCancel }) {
  const [form] = Form.useForm();
  let memberNo = getItem('memberNo');
  const [state, setState] = useState({
    visible,
    modalType: 'primary',
    checked: [],
  });
  // const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  //   // Can not select days before today and today
  //   return current && current < dayjs().endOf('day');
  // };

  const dateFormat = "YYYY-MM-DD";
  let today = new Date()
  function formatDate(date,format){
    const map = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      yyyy: date.getFullYear().toString()
      // yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yyyy/gi, matched => map[matched])
  }
  let nowDate = formatDate(today,'yyyy-mm-dd');

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date() )
  const [blind, setBlind] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState()

  const [challengeCreate, setChallengeCreate] =useState({
    title: "",
    content:"",
    personnel:"",
  })

  const blindCheck = () => {
    setBlind(!blind);
    console.log(blind)
  }
  const changeValue = (e) => {
    console.log(e);
    setChallengeCreate({
      ...challengeCreate,
      [e.target.name] : e.target.value
    })
    console.log(e.target.value)
  }

  const startDateValue = (e,dateString) => {
    console.log("Date e : " + e)
    console.log(dateString)
    setStartDate(dateString)
    console.log(dateString)
  }
  const endDateValue = (e,dateString) => {
    console.log("Date e : " + e)
    console.log(dateString)
    setEndDate({
      ...endDate,
      endDate: dateString
    })
  }

  let obj = Object.assign(challengeCreate, { blind },startDate,endDate)
  console.log("obj : ", obj)
  const submitChallenge = (e) => {
    e.preventDefault(); // submit이 action을 안타고 자기 할일을 그만함
    const confirmed = window.confirm("챌린지를 생성 하시겠습니까?")
    if(challengeCreate.title === "") {
      window.alert("챌린지 제목을 입력해주세요 ~")
      return false
    }else if(challengeCreate.personnel === "" && challengeCreate.personnel < 2 || challengeCreate.personnel > 10){
      window.alert(" 챌린지 인원수를 기재해주시고 2명이상 10명이하로 입력해주세요 ~")
      return false
    }else if(challengeCreate.content === ""){
      window.alert(" 챌린지 소개를 입력해주세요 ~")
      return false
    } else if(startDate === null){
      window.alert(" 시작날짜를 입력해주세요 ")
      return false
    }else if(endDate === null){
      window.alert(" 마감날짜를 입력해주세요 ")
      return false
    }
    // console.log(JSON.stringify(obj))
    if(confirmed) {
      fetch("https://jub.sionms.co.kr/challenge", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8", Authorization: `Bearer ${getItem('ACCESS_TOKEN')}`
        },
        body: JSON.stringify(obj)
      }).then((res) => {
        window.location.replace("challenge")
      });
    }
  }


  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setState({
        visible,
      });
    }
    return () => {
      unmounted = true;
    };
  }, [visible]);

  const handleOk = () => {
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };
  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
    <Modal
      type={state.modalType}
      title="챌린지 생성"
      visible={state.visible}
      footer={[
        <div key="1" className="project-modal-footer">
          <Button size="default" key="submit" onClick={submitChallenge} className="create-btn" >
            챌린지 만들기
          </Button>
          <Button size="default" type="white" key="back" outlined onClick={handleCancel}>
            취소
          </Button>
        </div>,
      ]}
      onCancel={handleCancel}
    >
      <div className="project-modal">
        <BasicFormWrapper>
          <Form form={form} name="createProject" onFinish={handleOk}>
            <Form.Item label="챌린지 이름">
              <Input
                rules={[{ max: 20, min: 5, message: '20자 이내로 적어주세요' }]}
                placeholder="챌린지 이름*"
                onChange={changeValue}
                name="title"
              />
            </Form.Item>
            <Form.Item initialValue="" label="">
              {/*<Select style={{ width: '100%' }} onChange={blindCheck} name="blind">*/}
              {/*  <Checkbox onClick={blindCheck} name="blind">비공개 챌린지</Checkbox>*/}
              {/*</Select>*/}
            </Form.Item>
            <Form.Item label="챌린지소개"  >
              <Input.TextArea rows={4} placeholder="챌린지 소개*" onChange={changeValue} name="content" />
            </Form.Item>

            <Form.Item name="personnel" label="챌린지 인원수*">
              <Input placeholder="챌린지원 인원수를 정해주세요 " onChange={changeValue} name="personnel" />
            </Form.Item>
            <Row gutter={15}>
              <Col md={12} xs={24}>
                <Form.Item label="챌린지 시작날짜*" name="startDate">
                    <DatePicker placeholder="yyyy-mm-dd" onChange={startDateValue} name="startDate"
                                disabledDate={(d) => d && d < dayjs().add(0, "day").endOf("day")}/>
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item label="챌린지 모집 마감날짜*" name="endDate">
                  <DatePicker placeholder="yyyy-mm-dd" onChange={endDateValue} name="endDate"
                              disabledDate={(d) => d && d < dayjs(startDate, dateFormat).add(-1, "day").endOf("day")}/>
                </Form.Item>
              </Col>
            </Row>
            {/*<Cards title="챌린지 사진" className="mb-25">*/}
            {/*  <div className="ninjadash_uploader-list">*/}
            {/*    <Dragger {...props}>*/}
            {/*      <p className="ant-upload-text">사진을 업로드 해주세요!</p>*/}
            {/*    </Dragger>*/}
            {/*  </div>*/}
            {/*</Cards>*/}
          </Form>
        </BasicFormWrapper>
      </div>
    </Modal>
    </>
  );

}

ChallengeCreate.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ChallengeCreate;
