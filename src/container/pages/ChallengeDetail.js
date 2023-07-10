import React, { useContext, useEffect, useState } from "react";
import '../../static/css/ChallengeDetail.css';
import ploggingImage from '../../static/img/plologo1.jpeg';
import ploggingImage3 from '../../static/img/ploggingImage3.png';
import ploggingImage2 from '../../static/img/줍깅로고-removebg-preview.png';
import { AvatarWraperStyle } from "../ui-elements/ui-elements-styled";
import { Avatar } from "antd";
import {
  UilAngleRight,
  UilCalender,
  UilGrin, UilListUiAlt, UilSick,
  UilTrees, UilUserNurse
} from "@iconscout/react-unicons";
import UilUsersAlt from "@iconscout/react-unicons/icons/uil-users-alt";
import UilArrowDown from "@iconscout/react-unicons/icons/uil-arrow-down";
import { useNavigate, useParams } from "react-router-dom";
import ChallengeSchedule from './ChallengeSchedule';
import { DataService } from "../../config/dataService/dataService";
import { getItem } from "../../utility/localStorageControl";
import { Button } from "../../components/buttons/buttons";
import UilPlus from "@iconscout/react-unicons/icons/uil-plus";
import { useSelector } from "react-redux";
import UilSmile from "@iconscout/react-unicons/icons/uil-smile";



const ChallengeDetail = () => {

  let params = useParams();
  let chNo = params.id;
  let memberNo = getItem('memberNo');

    const navigate = useNavigate();

  const [route, setRoute] = useState({});

  const [state, setState] = useState({
    visible: false,
  });
  const { visible } = state;
  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });

  };


  // 챌린지단일조회
  const [challenge, setChallenge] = useState({
    chNo:'',
    memberNo:'',
    title:'',
    content:'',
    startDate:'',
    endDate:'',
    challengers:[],
    challengeMemberCnt:'',
  });
  let challengers = challenge.challengers.filter(c => c)


  // 챌린지 맴버리스트 조회
  const [chMemberList, setChMemberList] = useState({
    cmemberNo:'',
    chNo:'',
    challenger:'',
    regDate:'',
  })
  console.log("chMemberList : " , chMemberList)
  // 챌린지 가입
  const [chMember, setChMember] =useState({
    chNo:'',
    challenger:'',
    regDate:new Date(),
  })

  // 해당 챌린지의 일정리스트
  const [challengeScheduleList, setChallengeScheduleList] = useState([{
    scheduleNo:'',
    chNo:'',
    startDate:'',
    mapNo:'',
    challengers:[],
    challengeMemberCnt:'',
  }]);

  // 해당일정에참여한 챌린지원정보
  const [scheduleMembers, setScheduleMembers] = useState([{
    smno:"",
    challenger:"",
    scheduleNo:"",
    chNo:"",
  }])
  let schNo = challengeScheduleList.filter((c)=> c.scheduleNo);
  let schMemberList = scheduleMembers.filter((c)=> {
    return schNo.includes(c.scheduleNo)
  })
  console.log("schMemberList : " , schMemberList)

  let dayWeekTransForm = challengeScheduleList.map((c) => {
    let startDate = new Date(c.startDate);
    let dayOfWeek = startDate.toLocaleString('ko-KR', { weekday: 'long' });
    return { startDate, dayOfWeek };
  });
  console.log("dayWeekTransForm : " , dayWeekTransForm)

  // 전체 맵정보
  const [mapList, setMapList] = useState([]);

  let dateTransform = challengeScheduleList.map((c) => {
    let startDate = new Date(c.startDate);
    let formattedDate = startDate.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
    return formattedDate;
  });
  // console.log("a : " , dateTransform)

  // const mapNoList = mapList.map((map) => (map.mapNo));
  const challengeMapNo = challengeScheduleList.map((c) => (c.mapNo));
  const scheduleNo = challengeScheduleList.map((c) => (c.scheduleNo));
  console.log("mapList : ", mapList);
  const mapInfo = mapList.filter((x) => {
    return challengeMapNo.includes(x.mapNo)
  })
  console.log("result : " , mapInfo)
  // 해당챌린지의 일정리스트 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DataService.get(`/ploggingList/${chNo}`);
        setChallengeScheduleList(response.data.data);
        // console.log("setChallengeScheduleList : " , response.data);
        // console.log(response.status);
      } catch (error) {
        // 에러 처리
        console.log("fetchData error")
      }
    };
    fetchData();
  }, []);

  // let obj = [{mapInfo, challengeScheduleList}]
  // console.log("objassign : " , obj)

  // 해당챌린지의 맴버불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DataService.get("challengeMember");
        setChMemberList(response.data.data);
        console.log("setChMemberList : " , response.data.data);
        // console.log(response.status);
      } catch (error) {
        // 에러 처리
        console.log("fetchData error")
      }
    };
    fetchData();
  }, []);
  // console.log("chMemberList : " , chMemberList.data);


  // 해당 챌린지 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DataService.get(`/challenge/chDetail/${chNo}`);
        setChallenge(response.data);
        // console.log(response.data);
        // console.log(response.status);
      } catch (error) {
        // 에러 처리
        console.log("fetchData error")
      }
    };
    fetchData();
  }, []);


  // 해당일정에참여한 챌린지원정보
  useEffect(() => {
    const fetchData = async () => {
      try {
        const scheduleNo2 = await DataService.get(`/ploggingList/${chNo}`);
        let scheduleNo = scheduleNo2.data.data.map((c) => c.scheduleNo);
        // 여러 개의 요청을 처리하기 위해 Promise 배열을 생성
        const requests = scheduleNo.map((no) => DataService.get(`/scheduleMemberList/${no}`));
        const responses = await Promise.all(requests);

        // 응답 결과를 병합하여 scheduleMembers를 설정
        const mergedData = responses.map((res) => res.data.data).flat();
        setScheduleMembers(mergedData);
        console.log("setScheduleMembers : " , response.data.data);
        // console.log(response.status);
      } catch (error) {
        // 에러
        console.log("fetchData error")
      }
    };
    fetchData();
  }, []);

  let schMembers = scheduleMembers.map((c)=> c.challenger);
  console.log("scheduleMembers : " , scheduleMembers.map((c)=> c.challenger) );

  let endDateTime = challenge.endDate;
  let endDay = new Date(endDateTime)
  let nowDay = new Date()
  console.log("endDateTime : " , endDay < nowDay)

  // 플로깅가입
  const challengeJoin = (e) => {
    e.preventDefault(); // submit이 action을 안타고 자기 할일을 그만함
    const confirmed = window.confirm("우리 지구를 깨끗하게 하는 플로깅! 해당 챌린지에 참여하시겠습니까?")
    if(challenge.challengers && Array.isArray(challenge.challengers) && challenge.challengers.length > 0
      && challenge.challengers.filter(a => {return a === memberNo}).length){
      window.alert("이미 가입한 챌린지입니다")
      return false;
    } else if(challenge.challengeMemberCnt === challenge.personnel){
      window.alert("인원이 마감된 챌린지 입니다")
      return false;
    } else if(memberNo === undefined){
      window.alert("로그인후 가입해주세요 ")
      return false;
    } else if(endDay < nowDay === true){
      window.alert("종료된 챌린지 입니다 ")
      return false;
    } else{
      window.alert("챌린지 가입이 완료되었습니다")
    }
    if(confirmed) {
      fetch(`https://jub.sionms.co.kr/challenge/chDetail/${chNo}`,{
        method:"POST",
        headers: {
          "Content-type":"application/json; charset=utf-8",Authorization: `Bearer ${getItem('ACCESS_TOKEN')}`
        },
        body: JSON.stringify(chMember)
      }).then((res)=>window.location.reload());
    }
  }
  // 일정참여취소
  console.log("scheduleMembers : ", scheduleMembers)
  const scheduleCancle = (e) => {
    e.preventDefault(); // submit이 action을 안타고 자기 할일을 그만함
    const confirmed = window.confirm("참여 취소하시겠습니까? ")

    if(confirmed && scheduleMembers.length >0) {
      const smno = scheduleMembers.map((c) => c.smno);
      fetch(`/scheduleCancle/${smno}`,{
        method:"DELETE",
        headers: {
          "Content-type":"application/json; charset=utf-8",Authorization: `Bearer ${getItem('ACCESS_TOKEN')}`
        },
        body: JSON.stringify(smno)
      }).then((res)=>res.json());
    }
  }


  const schMemberNo = scheduleMembers.filter((c)=> c.challenger === memberNo)
  console.log("schMemberNo === memberNo : " , schMemberNo);

  // console.log("schMemberInfo : " , schMemberInfo);
  console.log("loginNo : ", memberNo); // 현재 로그인한 회원번호
  console.log("challengeSchNo : ", scheduleNo); // 스케쥴번호 필요
console.log("challengeScheduleList : " , challengeScheduleList)


  const scheduleJoin = (e,scheduleNo) => {
    e.preventDefault(); // submit이 action을 안타고 자기 할일을 그만함
    const confirmed = window.confirm("일정에 참여하시겠습니까 ?")
    if(memberNo === undefined){
      window.alert("로그인후 참여 해주세요")
      return false;
    }
    if(confirmed) {
      const schObj = {
        scheduleNo: scheduleNo, // scheduleNo를 schObj에 할당
        memberNo,
        chNo
      };
      console.log(schObj);

      fetch("https://jub.sionms.co.kr/scheduleJoin",{
        method:"POST",
        headers: {
          "Content-type":"application/json; charset=utf-8",Authorization: `Bearer ${getItem('ACCESS_TOKEN')}`
        },
        body: JSON.stringify(schObj)
      }).then((res)=>
        window.location.reload(()=> confirmed("일정참여가 완료되었습니다"))
        // res.json()
      );
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
  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  return (
    <>
      <div className="challengedetail">
        <div className="detail-top">
          <AvatarWraperStyle>
            <span className="challenge-page"><Avatar icon={< UilListUiAlt />} className="challenge-icon" /> 챌린지 상세페이지 </span>
          </AvatarWraperStyle>
        </div>
        <div className="image-title">
            <img src={ploggingImage} alt="Logo" className="challengeImage" />
            <div className="chImageTitle">
            <p1>Challenge Plogging <br/> </p1>
            <h1>아름다운 지구지키기 <br/> '플로깅'</h1>
            <p2>건강한 지구를 위해 플로깅을 <br /> 동참해주셔서 감사드립니다</p2>
            </div>
        </div>

        <div className="chHeader">
          <AvatarWraperStyle>
            {endDay < nowDay === true && <span style={ {color:"red"} }><Avatar icon={< UilGrin />} className="chHeader-icon" />[종료된 챌린지]</span>}
            {endDay < nowDay === false && <span><Avatar icon={< UilGrin />} className="chHeader-icon" />[공식 챌린지]</span>}
            <span> {challenge.title} </span>
            {challenge.memberNo === memberNo && <button type="submit" className="delete-bt"> 챌린지 삭제하기 </button>}
            {challenge.memberNo !== memberNo && <button type="submit" className="signup-bt" onClick={challengeJoin}> 챌린지 가입하기 </button>}
          </AvatarWraperStyle>
        </div>

        <div className="chPersonnel">
          <AvatarWraperStyle>
            <span><Avatar icon={< UilUsersAlt />} className="chPersonnel-icon" /> 현재 {challenge.challengeMemberCnt}/{challenge.personnel}명
              {challenge.challengeMemberCnt === challenge.personnel && <span style={ {color:"red"} }> [ 해당 챌린지는 현재 인원마감 입니다 ]</span>}
            </span>
          </AvatarWraperStyle>
        </div>

        <div className="chPeriod">
          <AvatarWraperStyle>
            <div className="chPeriodDetail">
              <Avatar icon={< UilCalender />} className="chPeriodDetail-icon" />
              지구닦기 {challenge && challenge.startDate && <span>{challenge.startDate}</span>}
              ~ {challenge && challenge.endDate && <span>{challenge.endDate}</span>}
            </div>
          </AvatarWraperStyle>
        </div>

        <div className="chIntroduction">
          <img src={ploggingImage3} alt="Logo" className="challengeImage3" />
          <p className="Introduction">
            우리 챌린지는 ? <Avatar icon={< UilArrowDown />} className="chIntroduction-icon" />
          </p>
          <div className="IntroductionDetail">
            {challenge && challenge.content && <span>{challenge.content}</span>}
          </div>
        </div>
        <div className="chSchedule">
          <div className="scheduleHeader">
            <AvatarWraperStyle>
              <Avatar icon={< UilTrees />} className="scheduleHeader-icon" /> 상쾌한 아침 플로깅 챌린지의 플로깅 일정
            </AvatarWraperStyle>
          </div>
          {challengeScheduleList.length === 0 ? (
              <p>아직 등록된 챌린지 일정이 없습니다.</p>
            ) :(
            challengeScheduleList.map((chinfo, scheduleIndex) => {
            const route = mapInfo[scheduleIndex];
            const formattedDate = dateTransform[scheduleIndex];
            const dayTransForm = dayWeekTransForm[scheduleIndex]
            console.log("maps : " , route);
            return (
              <div className="scheduleForm" key={scheduleIndex}>
                <ul className="scheduleDay">
                  <li>{dayTransForm.dayOfWeek}</li>
                  <li>일정</li>
                </ul>
                <div className="scheduleDetail">
                  <p>{formattedDate}</p>
                  {route && <p onClick={() =>
                    navigate('/plogging/mapList/'+`${route.mapNo}`, { state: route })}>{route.courseName}</p>}
                </div>
                <div className="Participation" >
                    <button type="submit" className="chParticipation" key={chinfo.scheduleNo}
                           onClick={(e) => scheduleJoin(e, chinfo.scheduleNo)}> + 일정참여</button>
                  {challenge.memberNo === memberNo && <button type="submit" className="chscDelete"> + 일정삭제</button>}
                </div>
              </div>
            );
           })
          )}
        </div>


        <div className="scbutton">
          {challenge.memberNo === memberNo && <Button onClick={showModal} key="1" size="default" className="createPlogging">
            <span> + 플로깅 일정추가 </span>
          </Button>}
          {/*<button type="submit" className="scheduleButton"> + 플로깅 일정추가 </button>*/}
        </div>

        <div className="listBox">
          <h2><Avatar icon={< UilUsersAlt />} className="memberList-icon" /> 챌린지 회원리스트 총 {challenge.challengeMemberCnt} 명</h2>
          {challenge.challengers.map((c)=>  (<div className="memberList">
            <img src={ploggingImage2} alt="Logo" className="memberIcon" />
            <span>{c}번 회원<Avatar icon={< UilSmile />} className="memberList-icon" /> </span>
          </div>))}
        </div>

        <div className="precautions">
          <span className="precautionsHeader">
            <AvatarWraperStyle>
              {/*<Avatar icon={< UilStar />} className="precautionsHeader-icon" />*/}
              <p>  챌린지 진행시 주의사항 </p>
            </AvatarWraperStyle>
          </span>
          <div className="precautionsDetail">
            <AvatarWraperStyle>
              <p><Avatar icon={< UilSick />} className="precautionsDetail-icon" />레드카드 발급규정</p>
            </AvatarWraperStyle>
            <AvatarWraperStyle>
              <p><Avatar icon={< UilAngleRight />} className="precautionsDetail-icon" /> 챌린지원간의 불쾌한 일들을 방지하기 위하여 챌린지와 무관한 행동을 하거나 상대방에게 불쾌감을 줄 수 있는 행동을 신고받고 있습니다</p>
              <p><Avatar icon={< UilAngleRight />} className="precautionsDetail-icon" />  신고가 누적되면 정지 및 탈퇴 처리가 되실 수 있습니다 자세한 사항은 관리자에게 문의바랍니다.</p>
            </AvatarWraperStyle>
          </div>
        </div>
        <ChallengeSchedule onCancel={onCancel} visible={visible}  mapList={mapList} setMapList={setMapList}/>
      </div>
    </>
  );
};

export default ChallengeDetail;