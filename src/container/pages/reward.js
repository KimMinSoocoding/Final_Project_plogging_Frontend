import React from 'react';
import { Col, Row } from 'antd';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';

function Reward() {
  const rewardPage = [
    {
      path: '',
      breadcrumbName: '리워드',
    },
  ];
  return (
    <>
      <PageHeader className="ninjadash-page-header-main" title="리워드" routes={rewardPage} />
      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <Cards headless>
              <h3>리워드 페이지</h3>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default Reward;
