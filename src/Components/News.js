import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';

function throttle(func, delay) {
  let run = false;
  return function (...args) {
    if (!run) {
      func(...args);
      run = true;
      setTimeout(() => run = false, delay);
    }
  };
}

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
        articleLength: 0,
        isNoResponse: false,
        isError426: false,
        isRateLimited: false
      }
      document.title=`${this.capitalizeFirstLetter(this.props.category)} - NewsPanda`;
      this.throttledScroll = throttle(this.handleScroll, 400);
   }

  isFetching=false;

   async updateNews(){
    try {
      this.setState({loading: true});
      this.props.setProgress(10);
      let res=await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&language=en&sortBy=popularity&category=${this.props.category}&apiKey=${this.props.APIkey}&page=${this.state.page}&pageSize=${this.props.pageSize}`);
      this.props.setProgress(35);
      let response=await res.json();
      this.props.setProgress(55);
      this.setState({
        articles: response.articles,
        totalResults: response.totalResults,
        articleLength: response.articles.length,
        loading: false
      }, ()=>{
        this.props.setProgress(100);
      });
    } catch (error) {
      console.log("Couldn't fetch data:", error);
    }
   }
   handleScroll = async () => {
      this.isFetching=true;
      const nextPage=this.state.page + 1;
      this.setState(prevState => ({
        page: prevState.page + 1,
        loading: true
      }));
      try {
        let res=await fetch(`https://newsapi.org/v2/top-headlines?country=${this.props.country}&language=en&sortBy=popularity&category=${this.props.category}&apiKey=${this.props.APIkey}&page=${nextPage}&pageSize=${this.props.pageSize}`);
        if(res.status===426){
          this.setState({isError426: true, loading: false}, ()=>{
            this.isFetching=false;
            return;
          })
        }
        if (res.status === 429){
          this.setState({isRateLimited: true, loading: false}, ()=>{
            this.isFetching=false;
            return;
          })
        }
        if(!res.ok){
          this.setState({loading: false}, ()=>{
            this.isFetching=false;
            return;
          })
        }
        let response=await res.json();
        if(response.articles.length > 0){
          this.setState(prevState => ({
            articles: prevState.articles.concat(response.articles),
            articleLength: prevState.articleLength + response.articles.length,
            loading: false
          }), ()=>{
            this.isFetching=false;
          });
        }
        else{
          this.setState({ loading: false, isNoResponse: true }, ()=>{
            this.isFetching=false;
          });
        }
      } catch (error) {
        console.error("Error occured: ", error);
        this.setState({ loading: false }, () => {
          this.isFetching = false;
        });
      }
   }
   monitorScroll = async ()=>{
      if(this.state.isNoResponse) return;
      if(this.state.isError426) return;
      if(this.state.isRateLimited) return;
      if(this.isFetching) return;
      if(this.state.articleLength >= this.state.totalResults) return;
      if(window.innerHeight + window.scrollY + 1 < document.documentElement.scrollHeight) return;

      this.throttledScroll();
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
    clearTimeout(this.debounceTimer);
  }
  render() {
    return (
      <>
        <div className="container my-3">
          <h1 className="text-center">NewsPanda - Latest {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
          {<div className="row my-4">
            {
              this.state.articles.map((elements)=>{
                if(!elements.title) elements.title="";
                if(!elements.description) elements.description="";
                if(!elements.author) elements.author="Unknown";
                if(!elements.source.name) elements.source.name="Source Unknown";
                return <div className="col-md-4" key={elements.url || elements.title || Math.random()}>
                  <NewsItem title={elements.title} description={elements.description} imageUrl={elements.urlToImage} newsUrl={elements.url} author={elements.author} publishedAt={elements.publishedAt} name={elements.source.name}/>
                </div>
              })
            }
          </div>}
          {this.state.loading && <Spinner/>}
        </div>
      </>
    );
  }
}

export default News;
