import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';

export class News extends Component {
  static defaultProps={
    country: "us",
    pageSize: 9
  }
  static propTypes={
    country: PropTypes.string,
    pageSize: PropTypes.number
  }
  capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
   constructor(props){
      super(props);
      this.state={
        articles: [],
        loading: false,
        page: 1,
        totalResults: 0,
        articleLength: 0
      }
      document.title=`${this.capitalizeFirstLetter(this.props.category)} - NewsPanda`;
   }
  //  setStateAsync(stateUpdate){
  //   return new Promise( resolve => this.setState(stateUpdate, resolve) );
  //  }
  //  handlePrevClick = ()=>{
  //   this.setState(
  //     prevState => ({page: prevState.page - 1}),
  //     async ()=>{
  //       await this.updateNews();
  //     }
  //   );
  //  }
  //  handleNextClick = async ()=>{
  //   await this.setStateAsync( prevState =>({page: prevState.page + 1}) );
  //   await this.updateNews();
  //  }
  isFetching=false;

   async updateNews(){
    this.setState({loading: true});
    this.props.setProgress(10);
    let res=await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&lang=en&sortBy=popularity&category=${this.props.category}&apiKey=${this.props.APIkey}&page=${this.state.page}&pageSize=${this.props.pageSize}`);
    this.props.setProgress(35);
    let response=await res.json();
    this.props.setProgress(55);
    this.setState({
      articles: response.articles,
      totalResults: response.totalResults,
      articleLength: response.articles.length,
      loading: false
    });
    this.props.setProgress(100);
   }
   monitorScroll = async ()=>{
    if(!this.isFetching && window.innerHeight + window.scrollY + 1 >= document.documentElement.scrollHeight && this.state.articleLength < this.state.totalResults){
      this.isFetching=true;
      const nextPage=this.state.page + 1;
      this.setState(prevState => ({
        page: prevState.page + 1,
        loading: true
      }));
      let res=await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&lang=en&sortBy=popularity&category=${this.props.category}&apiKey=${this.props.APIkey}&page=${nextPage}&pageSize=${this.props.pageSize}`);
      let response=await res.json();
      this.setState(prevState => ({
        articles: prevState.articles.concat(response.articles),
        articleLength: prevState.articleLength + response.articles.length,
        loading: false
      }));
      this.isFetching=false;
    }
   }
   async componentDidMount(){
    window.addEventListener("scroll", this.monitorScroll);
    await this.updateNews();
   }
   componentDidUpdate(prevProps){
    if(this.props.category !== prevProps.category) window.scrollTo(0, 0);
   }
   componentWillUnmount() {
    window.removeEventListener("scroll", this.monitorScroll);
  }
  render() {
    return (
      <>
        <div className="container my-3">
          <h1 className="text-center">NewsPanda - Latest {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
          {/* {this.state.loading && <Spinner/>} */}
          {<div className="row my-4">
            {
              this.state.articles.map((elements)=>{
                if(elements.title===null) elements.title="";
                if(elements.description===null) elements.description="";
                return <div className="col-md-4" key={elements.url}>
                  <NewsItem title={elements.title} description={elements.description} imageUrl={elements.urlToImage} newsUrl={elements.url} author={elements.author} publishedAt={elements.publishedAt} name={elements.source.name}/>
                </div>
              })
            }
          </div>}
          {this.state.loading && <Spinner/>}
          {/* <div className="d-flex justify-content-center my-5">
          <button type="button" className="btn btn-primary mx-2" disabled={this.state.page<=1} onClick={this.handlePrevClick}>&larr; Prev</button>
          <button type="button" className="btn btn-primary mx-2" disabled={Math.ceil(this.state.totalResults/this.props.pageSize) === this.state.page} onClick={this.handleNextClick}>Next &rarr;</button>
          </div> */}
        </div>
      </>
    );
  }
}

export default News;
