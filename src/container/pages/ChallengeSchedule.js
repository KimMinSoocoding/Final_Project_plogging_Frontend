import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Select, Col, Row, DatePicker, Avatar, Card } from "antd";
import propTypes from 'prop-types';
import { Button } from '../../components/buttons/buttons';
import { Modal } from '../../components/modals/antd-modals';
import { BasicFormWrapper } from '../styled';
import '../../static/css/ChallengeDetail.css';
import dayjs from "dayjs";
import { DataService } from "../../config/dataService/dataService";
import { UilCalender, UilMapMarkerPlus } from "@iconscout/react-unicons";
import { AvatarWraperStyle } from "../ui-elements/ui-elements-styled";
import FontAwesome from "react-fontawesome";
import { CourseCardWrap } from "../../components/cards/Style";
import UilMapMarker from "@iconscout/react-unicons/icons/uil-map-marker";
import UilClock from "@iconscout/react-unicons/icons/uil-clock";
import { setHours, setMinutes } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { getItem } from "../../utility/localStorageControl";
import { useInView } from "react-intersection-observer";
import { KnowledgebaseTopWrap } from "./knowledgeBase/style";
import UilLocationPinAlt from "@iconscout/react-unicons/icons/uil-location-pin-alt";
import '../../static/css/ploggingPageStyle.scss';
import UilExclamationCircle from "@iconscout/react-unicons/icons/uil-exclamation-circle";

const { Option } = Select;

function Redirect() {
  return null;
}
function ChallengeSchedule({ visible, onCancel,mapList,setMapList }) {
  const [form] = Form.useForm();
  let params = useParams();
  const [secondModalVisible, setSecondModalVisible] = useState(false);

  // 무한스크롤링
  const [watch, inView] = useInView();
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const navigate = useNavigate();


  const [state, setState] = useState({
    visible,
    checked: [],
  });

  const showSecondModal = () => {
    setSecondModalVisible(true);
  }

  const closeModal = () => {
    setSecondModalVisible(false);
  }

  const handleSecondModalCancel = () => {
    setSecondModalVisible(false);
  };


  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  // const dateFormat = "YYYY-MM-DD-HH:DD";
  let today = new Date()
  function formatDate(date,format){
    const map = {
      mm: date.getMonth() + 1,
      dd: date.getDate(),
      yyyy: date.getFullYear().toString(),
      HH:date.getHours().toString(),
      DD:date.getMinutes().toString()
      // yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|HH|DD|yyyy/gi, matched => map[matched])
  }
  let nowDate = formatDate(today,'yyyy-mm-dd-HH:DD');
  // console.log(nowDate)

  const [startDate, setStartDate] = useState(new Date())

  const startDateValue = (e,dateString) => {
    console.log("Date e : " + e)
    console.log(dateString)
    setStartDate(dateString)
    console.log(dateString)
  }


  useEffect(() => {
    if (inView && !lastPage && !setResult) {
      loadMapList();
      paging();
    }
  }, [mapList, inView]);
  const paging = () => {
    setPage((page) => page + 1);
  };
  const loadMapList = () => {
    DataService.get(`/plogging?page=${page}`)
      .then(function (response) {
        console.log(response);
        if (response.data.data.content.last) {
          setLastPage(true);
        }
        setMapList((mapList) => mapList.concat(...response.data.data.content));
      })
      .catch(function (error) {});
  };
  useEffect(() => {
    loadMapList();
  }, []);


  const [selectedMapName, setSelectedMapName] = useState(null);
  const [selectedMapNo, setSelectedMapNo] = useState({
    mapNo:'',
  });
  const handleMapItemClick = (coureseName,mapNo) => {
    setSelectedMapName(coureseName); // 선택된 지도 이름 상태 업데이트
    setSelectedMapNo({
      ...selectedMapNo,
       mapNo: mapNo
    })
    closeModal();
  }
  // console.log("selectedMapName : " , selectedMapName)
  // console.log("selectedMapNo : " , selectedMapNo)


  // 플로깅 일정추가
  // let mapNoList = mapList.filter((e)=>e.mapNo).map((data)=> data.mapNo);
  let chNo = { chNo :  params.id };
  // let obj = Object.assign(chNo,ploggingPersonnel,startDate,selectedMapNo)
  let obj = {...chNo, startDate, ...selectedMapNo}
  // console.log("obj:", JSON.stringify(obj))
  const submitPlogging = (e) => {
    e.preventDefault(); // submit이 action을 안타고 자기 할일을 그만함
    const confirmed = window.confirm("일정을 생성하시겠습니까?")
    if(selectedMapName === null  && selectedMapNo.mapNo === "" ){
      window.alert("플로깅 경로를 선택해주세요")
      return false;
    }
    // console.log(JSON.stringify(obj))
    if(confirmed) {
      try {
        fetch("https://jub.sionms.co.kr/ploggingCreate", {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=utf-8", Authorization: `Bearer ${getItem('ACCESS_TOKEN')}`
          },
          body: JSON.stringify(obj)
        }).then((res) => {
          window.location.reload();
        });
      }catch (error){
        window.alert("플로깅 일정 추가에 실패하였습니다 선택하지 않은 값이 있는지 확인해주세요")
      }
    }
  }

  //검색
  const [searchResult, setSearchResult] = useState(false); //검색결과 있는지 여부
  const [setResult, setSetResult] = useState(false); // 검색결과인지
  const [keyword, setKeyword] = useState('');
  const inputMapKeyword = (e) => {
    setKeyword(e.currentTarget.value);
  };

  const searchMapRoute = () => {
    e.preventDefault();
    if (keyword === '') {
      setMapList([]);
      setPage(0);
      loadMapList();
      setSetResult(false);
    } else {
      DataService.get(`/plogging/search?keyword=${keyword}`).then((response) => {
        if (!response.data.data) {
          setMapList([]);
          setSearchResult(true);
        } else {
          setSetResult(true);
          setMapList(response.data.data);
        }
      });
    }
  };
  function ploggingStartClick() {
    if (memberNo) {
      navigate(nav, { state: route });
    } else {
      selfDestroyed();
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
  return (
    <>
      <Modal
        type={state.modalType}
        title="플로깅일정 생성"
        visible={state.visible}
        footer={[
          <div key="1" className="project-modal-footer">
            <Button size="default"  key="submit" className="challengeAddButton" onClick={submitPlogging} >
              플로깅 일정추가
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
              <Row gutter={15}>
                <Col md={12} xs={24}>
                  <Form.Item label="플로깅 시작날짜&시간*" name="startDate">
                    <DatePicker placeholder="년도-월-일" onChange={startDateValue} name="startDate"
                                showTime
                                format="YYYY-MM-DD HH:mm"
                                disabledDate={(d) => d && d < dayjs().add(0, "day").endOf("day")}/>
                  </Form.Item>
                  <AvatarWraperStyle>
                    <Button onClick={showSecondModal} key="1" size="default" className="ploggingBtn">
                        <Avatar icon={< UilMapMarkerPlus />} className="ploggingBtn-icon" />플로깅 추천경로 선택하기
                    </Button>
                  </AvatarWraperStyle>
                  {selectedMapName}
                </Col>
              </Row>
            </Form>
          </BasicFormWrapper>
        </div>
      </Modal>

      <Modal
        visible={secondModalVisible}
        onCancel={handleSecondModalCancel}
        footer={[
          <div key="1" className="project-modal-footer">
            <Button size="default"  key="submit" className="challengeAddButton" >
              플로깅 경로추가
            </Button>
            <Button size="default" type="white" key="back" outlined onClick={handleSecondModalCancel}>
              취소
            </Button>
          </div>,
        ]}
      >
        <div className="project-modal">
          <BasicFormWrapper>
            <Form form={form} name="createProject" onFinish={handleOk}>
              <Row gutter={15}>
                <Col md={12} xs={24}>
                  <div className="ploggingSearch">
                    {mapList &&
                      mapList.map((maps) => (
                        <div key={maps.mapNo} ref={maps.mapNo % 5 == 0 ? watch : null}>
                          <CourseCardWrap className="ninjadash-course-card-single"
                                          onClick={() => handleMapItemClick(maps.courseName, maps.mapNo)}
                          >
                            <Card bordered={false}>
                              <div className="ninjadash-course-card-content">
                                <h4 className="ninjadash-course-card-title" >
                                  {maps.mapNo}번 코스 <hr/>
                                  {maps.courseName}
                                </h4>
                                <div className="ninjadash-course-card-author">
                                  <span className="ninjadash-course-card-author__name">{maps.courseDetail}</span>
                                </div>
                                <div className="ninjadash-course-card-meta">
                                  <div className="ninjadash-course-card-meta__left">
                                    <span className="ninjadash-course-card-meta__pricing">{maps.distance}Km</span>
                                  </div>
                                  <ul className="ninjadash-course-card-meta__right">
                                    <li className="bg-secondary" style={{ background: '#17C382' }}>
                                      <UilMapMarker style={{ color: 'white' }} />
                                      <span style={{ color: 'white' }}>{maps.addr}</span>
                                    </li>
                                    <li className="bg-primary" style={{ background: '#227C9D' }}>
                                      <UilClock style={{ color: 'white' }} />
                                      <span style={{ color: 'white' }}>{maps.time / 60} 시간</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Card>
                          </CourseCardWrap>
                          {selectedMapName !== null && <BasicFormWrapper mapNo={selectedMapName} ></BasicFormWrapper>}
                          {selectedMapNo !== null && <BasicFormWrapper coureseName={selectedMapNo} ></BasicFormWrapper>}
                        </div>
                      ))}
                  </div>
                </Col>
              </Row>
            </Form>
          </BasicFormWrapper>
        </div>
      </Modal>

    </>
  );

}

ChallengeSchedule.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ChallengeSchedule;
