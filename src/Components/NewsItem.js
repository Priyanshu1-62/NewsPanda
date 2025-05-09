import React, { Component } from "react";

export class NewsItem extends Component {
  render() {
    const { title=" ", description=" ", imageUrl, newsUrl, author, publishedAt, name } = this.props;
    return (
      <>
        <div className="my-3">
          <div className="card">
            <div className="position-absolute bg-danger px-2 py-0.9 rounded-pill fw-bold" style={{top: "-1.6%", right: "-2%", fontSize: "0.8em", color: "white"}} aria-label="MyOwnBadgeElement">{name}</div>
            <img src={imageUrl?imageUrl:"https://neurosciencenews.com/files/2025/04/ultra-processed-foods-death-neuroscience.jpg"} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text">{description}</p>
              <p className="card-text"><small className="text-body-secondary">By {author} on {publishedAt?(new Date(publishedAt)).toGMTString():"(Time unspecified)"}</small></p>
              <a href={newsUrl} rel="noreferrer" target="_blank" className="btn btn-sm btn-primary">Read More</a>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default NewsItem;
