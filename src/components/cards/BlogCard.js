import UilFile from "@iconscout/react-unicons/icons/uil-file-alt";
import UilHeart from "@iconscout/react-unicons/icons/uil-heart-sign";
import propTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { BlogCardStyleWrap } from "./Style";
import { DataService } from "../../config/dataService/dataService";

function BlogCard({ item, theme }) {
  const {name, detail, img } = item;
  const [Donation, setDonation] = useState([]);

  useEffect(() => {
    DataService.get("/reward/list/Donation")
      .then((response) => {
        setDonation(response.data);
        console.log("RewardDonationList : " + Donation);
        console.log("RewardDonationList : " + response.data);
      })
      .catch((error) => {
        console.log("에러 :" + error);
      });
  }, []);

  return (
    <BlogCardStyleWrap>
      {Donation.slice(0,7).map((response) => (
        <figure className={`ninjadash-blog ninjadash-blog-${theme}`}>
          <div className="ninjadash-blog-thumb">
            <img className="ninjadash-blog__image" src={require(`../../static/img/pages/rewardImg/${img}`)}
                 alt="ninjadash Blog" />
          </div>
          <figcaption>
            <h2 className="ninjadash-blog__title">
              <span>{response.name}</span>
            </h2>
            <div className="ninjadash-blog__bottom">
              <p className="ninjadash-blog__text">{response.detail}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </BlogCardStyleWrap>
  );
}

BlogCard.propTypes = {
  item: propTypes.object,
  theme: propTypes.string
};

export default BlogCard;
