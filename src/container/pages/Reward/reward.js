import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import { DataService } from "../../../config/dataService/dataService";
import { Button } from "../../../components/buttons/buttons";
import "../../../static/css/rewardPageStyle.scss";
import { Row, Col, Card, Image } from "antd";
import MyRankInfo from "./MyRankInfo";
import RankList from "./RankList";
import RewardProductList from "./rewardProductList";
import { getItem } from "../../../utility/localStorageControl";
import BlogCard from "../../../components/cards/BlogCard";
import ploggingImg from "../../../static/img/pages/rewardImg/plogging.png";
import pointImg from "../../../static/img/pages/rewardImg/point.png";
import uploadImg from "../../../static/img/pages/rewardImg/Camera.png";
import randumBoxImg from "../../../static/img/pages/rewardImg/randumbox.png";
import donationImg from "../../../static/img/pages/rewardImg/donation.png";
import donationHeaderImg from "../../../static/img/pages/rewardImg/donation-header.png";
import arrowRightImg from "../../../static/img/pages/rewardImg/arrow-right.png";
import { alertModal } from "../../../components/modals/antd-modals";
import { isSuccess } from "auth0-lock/lib/sync";
import { useNavigate } from "react-router-dom";

const Reward = () => {
  const [rewardList, setRewardList] = useState([]);
  const [rankingList, setRankingList] = useState([]);
  const memberNo = getItem("memberNo");
  const [myRank, setMyRank] = useState([]);
  const [donationList, setDonationList] = useState([]);
  const [donationPoint, setDonationPoint] = useState([]);
  const [currentPoint, setCurrentPoint] = useState([]);
  const [donationDisabled, setDonationDisabled] = useState(false);
  const [productDisabled, setProductDisabled] = useState(false);

  const changePage = useNavigate();

  useEffect(() => {
    DataService.get(`/reward/list/`).then(function(response) {
      setRewardList(response.data.data);
    });
  }, []);

  /**
   * @Author 이재원
   * @Date 23.06.29
   * @Brief 기부하기 기능
   */
  const createDonation = () => {
    fetch("https://jub.sionms.co.kr/history/Donation", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        Authorization: `Bearer ${getItem("ACCESS_TOKEN")}`
      },
      body: JSON.stringify({
        memberNo: memberNo,
        type: "Donation",
        point: -1000
      })
    })
      .then(() => {
        alertModal.success({
          title: "기부가 성공적으로 처리 되었습니다",
          content: "기부 해주셔서 감사합니다",
          onOk() {
            location.reload();
          }
        });
      });
  };

  /**
   * @Author 이재원
   * @Date 23.06.29
   * @Brief 랜덤박스 신청
   */
  const createProduct = () => {
    fetch("https://jub.sionms.co.kr/history/Product", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        Authorization: `Bearer ${getItem("ACCESS_TOKEN")}`
      },
      body: JSON.stringify({
        memberNo: memberNo,
        type: "Product",
        point: -8000
      })
    })
      .then(() => {
        alertModal.success({
          title: "랜덤박스 신청이 성공적으로 처리 되었습니다",
          onOk() {
            location.reload();
          }
        });
      });
  };

  /**
   * @Author 이재원
   * @Date 23.06.29
   * @Brief 회원의 등급, 누적포인트 조회
   */
  useEffect(() => {
    if(memberNo){
      DataService.get("/history/rank/badge/" + memberNo)
        .then(function(response) {
          setMyRank(response.data);
          console.log("data badge : ", response.data);
          console.log("reward data badgeNo : ", response.data.badgeNo)
        });
    }
  }, []);

  /**
   * @Author 이재원
   * @Date 23.06.29
   * @Brief 회원의 기부한 포인트 조회
   */
  useEffect(() => {
    if(memberNo) {
      DataService.get("/history/donationPoint/" + memberNo)
        .then(function(response) {
          setDonationPoint(response.data);
          console.log("dataDonationPoint", response.data);
        });
    }
  }, []);

  /**
   * @Author 이재원
   * @Date 23.06.29
   * @Brief 회원의 현재 포인트를 활용하여 기부하기 버튼이나
   * @Brief 랜덤박스 신청 버튼을 활성화 및 비활성화
   */
  useEffect(() => {
    if(memberNo){
      DataService.get("/history/currentPoint/" + memberNo)
        .then(function(response) {
          setCurrentPoint(response.data);
          console.log("current Point : ", response.data);
          return response.data;
        }).then((data) => {
        console.log("data : ", data);
        if (data >= 1000) {
          console.log("data >= 1000: ", data);
          setDonationDisabled(false);
        } else {
          setDonationDisabled(true);
        }
        if (data >= 8000) {
          setProductDisabled(false);
        } else {
          setProductDisabled(true);
        }
      });
    }
  });

  const showConfirm = (type) => {
    if(memberNo) {
      alertModal.confirm({
        title: type === "Product" ? "랜덤박스 신청을 하시겠습니까?" : "기부를 하시겠습니까?",
        content: type === "Product" ? "신청을 하시면 회원님의 8000포인트가 차감 됩니다." : "기부하시면 회원님의 1000포인트가 차감 됩니다",
        onOk() {
          console.log("ok 누름");
          type === "Product" ? createProduct() : createDonation();
        },
        onCancel() {
        }
      });
    } else {
      selfDestroyed();
    }
  };

  const selfDestroyed = () => {
    let secondsToGo = 1.2;
    const modal = alertModal.success({
      title: '로그인 후 이용해 주세요',
      content: '',
    });

    setTimeout(() => {
      modal.destroy();
      changePage('/member/signin')
    }, secondsToGo * 1000);
  };


  return (
    <>
      <div className="rewardpage-wrapper">
        <div className="rewardpage-info">
          <div className="container">
            <h2>포인트 적립 안내</h2>
            <div className="container-body-header">
              <span>
              플로깅이나 챌린지를 통해 포인트를 적립하고 친환경 랜덤박스와 기부를 할 수 있습니다 <br />
                산책도 하고 운동도 하고 환경도 지키고 기부도 하고! 친환경 제품도 구매도 해보세요!
               </span>
            </div>
            {memberNo ? (
              <div className="container-info-header" style={{ padding: "0" }}>
                <MyRankInfo myRank={myRank} />
              </div>
            ) : ''}
            <div className="card-wrapper">
              <Card className="card">
                <Row gutter={16}>
                  <Col span={24}>
                    <h3>플로깅, 챌린지 참여</h3>
                    <Image src={ploggingImg} alt={ploggingImg} />
                  </Col>
                </Row>
              </Card>
              <Image className="arrowimage" src={arrowRightImg} alt={arrowRightImg} />
              <Card className="card">
                <Row gutter={16}>
                  <Col span={24}>
                    <h3>인증샷 작성</h3>
                    <Image src={uploadImg} alt={uploadImg} />
                  </Col>
                </Row>
              </Card>
              <Image className="arrowimage" src={arrowRightImg} alt={arrowRightImg} />
              <Card className="card">
                <Row gutter={16}>
                  <Col span={24}>
                    <h3>포인트 획득</h3>
                    <Image src={pointImg} alt={pointImg} />
                  </Col>
                </Row>
              </Card>
              <Image src={arrowRightImg} alt={arrowRightImg} />
              <Card className="card">
                <Row gutter={24}>
                  <Col span={24}>
                    <h4>친환경 랜덤박스 신청</h4>
                    <h3 style={{ marginBottom: "45px" }}>포인트 기부</h3>
                    <Image src={randumBoxImg} alt={randumBoxImg} style={{ height: "99px" }} />
                    <Image src={donationImg} alt={donationImg} style={{ height: "99px" }} />
                  </Col>
                </Row>
              </Card>
            </div>
          </div>
        </div>
        <div className="rewardpage-rank">
          <Row>
            <Col xxl={17} xs={24} span={12} offset={3} style={{ marginTop: 20, display: "flex" }}>
              <RankList />
            </Col>
          </Row>
        </div>
        <div className="rewardpage-product">
          <div className="container-product">
            <h2>랜덤박스</h2>
            <div className="container-body-product">
              <span>
                회원님이 적립하신 포인트로 랜덤박스를 신청하시면 친환경 제품을 랜덤으로 보내 드립니다! <br />
                랜덤박스는 회원님의 기본 배송지로 전달되며 신청 기준 4~5일이 소요 될 수 있습니다.
              </span>
            </div>
            <div className="product-table-wrapper">
              <div className="container-product-wrapper">
                <h3>랜덤박스 구성품  (회원님의 현재 포인트는 {currentPoint}P 입니다)</h3>
              </div>
              <RewardProductList />
            </div>
            <Button
              key="submit"
              type="primary"
              size="default"
              className="productButton"
              disabled={productDisabled}
              onClick={() => showConfirm("Product")}>
              {productDisabled ? <span>회원님의 포인트가 부족합니다. <br /> 필요한 포인트는 8000P 입니다.</span> : "랜덤박스 신청하기"}
              {productDisabled ? "" : <p>-8000P</p>}
            </Button>
          </div>
        </div>
        <div className="rewardpage-donation">
          <div className="container-donation">
            <Row justify={"left"} style={{width: "100%"}}>
              <h2>기부하기</h2>
              <Col span={24} >
                <div className="container-body-donation">
                  <span>
                    회원님들의 기부하신 포인트를 모아 지원 내용을 검토해 캠페인 기부에 활용 됩니다.
                  </span>
                  {memberNo ? (
                    <div className="useDonation">
                      <span>
                        현재 회원님의 기부하신 포인트는 {donationPoint * -1}P 입니다
                      </span>
                    </div>
                  ) : ''}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24} >
                <Image src={donationHeaderImg} alt={donationHeaderImg} className="justify-content-center" />
                <Button
                  type="primary"
                  size="default"
                  className="donationButton"
                  disabled={donationDisabled}
                  onClick={() => showConfirm("Donation")}
                >
                  {donationDisabled ? <p>회원님의 포인트가 부족합니다 <br /> 필요한 포인트는 1000P 입니다</p> : <p>기부하기 <br /> - 1000P</p>}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div className="container-donation-wrap">
                  <h2>기부처</h2>
                  <div className="donation-company">
                    <BlogCard />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
    ;
};
export default Reward;
