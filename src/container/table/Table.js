// import React from 'react';
// import { Row, Col, Table } from 'antd';
// import DragAndDropTable from './DragTable';
// import { PageHeader } from '../../components/page-headers/page-headers';
// import { Cards } from '../../components/cards/frame/cards-frame';
// import { Main } from '../styled';
// import SaleByLocation from '../dashboard/overview/index/SalesByLocation';
// import GeneratedRevenue from '../dashboard/overview/demoTwo/RevenueGenerated';
// import BestSeller from '../dashboard/overview/demoTwo/BestSeller';
// import TopSellingProduct from '../dashboard/overview/index/TopSellingProducts';
// import BrowseState from '../dashboard/overview/index/BrowserState';
//
// // function Tables() {
//   const dataSource = [
//     {
//       key: '1',
//       name: 'Mike',
//       age: 32,
//       address: '10 Downing Street',
//     },
//     {
//       key: '2',
//       name: 'John',
//       age: 42,
//       address: '10 Downing Street',
//     },
//   ];
//
//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Age',
//       dataIndex: 'age',
//       key: 'age',
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       key: 'address',
//     },
//   ];
//
//   return (
//     <>
//       <PageHeader ghost title="Table" />
//       <Main>
//         <Row gutter={15}>
//           <Col xs={24}>
//             <Cards title="Basic Usage">
//               <Table className="table-responsive" pagination={false} dataSource={dataSource} columns={columns} />
//             </Cards>
//           </Col>
//           <Col xs={24}>
//             <SaleByLocation />
//           </Col>
//           <Col xs={24}>
//             <GeneratedRevenue />
//           </Col>
//           <Col xs={24}>
//             <BestSeller />
//           </Col>
//           <Col xl={12} xs={24}>
//             <TopSellingProduct />
//           </Col>
//           <Col xl={12} xs={24}>
//             <BrowseState />
//           </Col>
//           <Col xs={24}>
//             <DragAndDropTable />
//           </Col>
//         </Row>
//       </Main>
//     </>
//   );
// }
//
// export default Tables;
