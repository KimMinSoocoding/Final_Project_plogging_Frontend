import React, { useState } from "react";
import { BlogCardStyleWrap } from "../../../components/cards/Style";
import { Link } from "react-router-dom";
import { UilComment } from "@iconscout/react-unicons";
import image from "../../../static/img/preview3.png";
import badge from "../../../static/img/logodemo.png";


const BoardLayout = (data) => {
  const bno = data.board.bno;
  const category = data.board.category;
  const writerNo = data.board.memberNo;
  const writerId = data.board.userId;
  const title = data.board.title;
  const content = data.board.content;
  const regDate = data.board.regDate;
  const updateDate = data.board.updateDate;
  const plogging = data.board.ploggingNo;
  const replyCnt = data.board.replyCount;
  const attach = data.board.attach;

  return (
    <BlogCardStyleWrap>
      <figure style={{boxShadow:"1px 1px 3px rgb(227 230 239 / 60%)"}} className={`ninjadash-blog ninjadash-blog-style-2`}>
        <div className="ninjadash-blog-thumb">
          {attach ? (
            <img className="ninjadash-blog__image" src={`http://13.209.48.33/attach/display?uuid=${attach.uuid}&path=${attach.path}&ext=${attach.ext}&filename=${attach.filename}`} alt="plogging" />
          ) :(
            <img className="ninjadash-blog__image" src={image} alt="테스트용" />
            )
          }
        </div>
        <figcaption>
          <div className="ninjadash-blog-meta ninjadash-blog-meta-theme-2">
            <span className="ninjadash-blog-meta__single ninjadash-category-meta">
              {category === 'PLOGGING' ? (
                <span style={{color : "#FFCB77"}}>플로깅</span>
              ) : category === 'COMMUNITY' ? (
                <span style={{color : "#47B0D7"}}>일상</span>
              ) : ''
              }
            </span>
            <span className="ninjadash-blog-meta__single ninjadash-date-meta">{regDate}</span>
          </div>
          <h2 className="ninjadash-blog__title" style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow:"ellipsis"}}>
            <span style={{height:30}}>{title}</span>
          </h2>
          <p className="ninjadash-blog__text"
             style={{height:40, overflow:"hidden", whiteSpace: "nowrap", textOverflow:"ellipsis"}}>{content}</p>
          <div className="ninjadash-blog__bottom">
            <div className="ninjadash-blog__author">
              <img className="ninjadash-blog__author-img" src={badge} alt="뱃지" />
              <span className="ninjadash-blog__author-name">{writerId}</span>
            </div>
            <ul className="ninjadash-blog__meta">
              <li className="ninjadash-blog__meta--item">
                {!!replyCnt ? (
                  <span className="view">
                  <UilComment size={30} />
                  <span>{replyCnt}</span>
                </span>
                ) : ''}
              </li>
            </ul>
          </div>
        </figcaption>
      </figure>
    </BlogCardStyleWrap>
  );

};

export default React.memo(BoardLayout);