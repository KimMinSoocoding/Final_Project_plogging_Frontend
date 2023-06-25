import React from 'react';
import { Row, Col } from 'antd';
import BlogCard from '../../../components/cards/BlogCard';
import { Main } from '../../styled';

import cardData from '../../../demoData/sampleCards.json';
const { BlogCardData } = cardData;

function BlogOne() {
  const PageRoutes = [
    {
      path: '',
      breadcrumbName: 'Blog One',
    },
  ];
  return (
    <>
      <Main>
        <Row gutter={25} className="mt-sm-10">
          {BlogCardData.slice(0, 7).map((blog) => {
            return (
              <Col key={blog.id} xl={6} sm={12} xs={24}>
                <BlogCard item={blog} />
              </Col>
            );
          })}
        </Row>
      </Main>
    </>
  );
}

export default BlogOne;
