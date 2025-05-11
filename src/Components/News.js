import React, { useEffect, useState, useRef } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

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

const News = (props) => {
  
  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
  const [articles, setArticles]=useState([]);
  const [loading, setLoading]=useState(false);
  const [page, setPage]=useState(1);
  const [totalResults, setTotalResults]=useState(0);
  const [articleLength, setArticleLength]=useState(0);
  const [isNoResponse, setIsNoResponse]=useState(false);
  const [isError426, setIsError426]=useState(false);
  const [isRateLimited, setIsRateLimited]=useState(false);
  const articlesRef=useRef([]);
  const loadingRef=useRef(false);
  const pageRef=useRef(1);
  const totalResultsRef=useRef(0);
  const articleLengthRef=useRef(0);
  const isNoResponseRef=useRef(false);
  const isError426Ref=useRef(false);
  const isRateLimitedRef=useRef(false);
  const isFetchingRef=useRef(false);

  document.title=`${capitalizeFirstLetter(props.category)} - NewsPanda`;

   const updateNews = async () => {
    try {
      props.setProgress(10);
      await new Promise(resolve => setTimeout(resolve, 100));
      setLoading(true);
      let res=await fetch(`https://newsapi.org/v2/top-headlines?country=${props.country}&language=en&sortBy=popularity&category=${props.category}&apiKey=${props.APIkey}&page=${pageRef.current}&pageSize=${props.pageSize}`);
      props.setProgress(35);
      let response=await res.json();
      setArticles(response.articles);
      setTotalResults(response.totalResults);
      setArticleLength(response.articles.length);
      setLoading(false);
      props.setProgress(100);
    } catch (error) {
      console.log("Couldn't fetch data:", error);
    }
   }
   const handleScroll = async () => {
      isFetchingRef.current=true;
      const nextPage=pageRef.current + 1;
      pageRef.current = nextPage;
      setPage(pageRef.current);
      setLoading(true);
      try {
        let res=await fetch(`https://newsapi.org/v2/top-headlines?country=${props.country}&language=en&sortBy=popularity&category=${props.category}&apiKey=${props.APIkey}&page=${nextPage}&pageSize=${props.pageSize}`);
        if(res.status===426){
          setIsError426(true);
          setLoading(false);
          return;
        }
        if (res.status === 429){
          setIsRateLimited(true);
          setLoading(false);
          return;
        }
        if(!res.ok){
          setLoading(false);
          return;
        }
        let response=await res.json();
        if(response.articles.length > 0){
          setArticles(prevArticles => prevArticles.concat(response.articles));
          setArticleLength(prevArticleLength => prevArticleLength + response.articles.length);
          setLoading(false);
        }
        else{
          setIsNoResponse(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error occured: ", error);
        setLoading(false);
      }
   }
  const throttledScroll = throttle(handleScroll, 400);

   const monitorScroll = async ()=>{
      if(isNoResponseRef.current) return;
      if(isError426Ref.current) return;
      if(isRateLimitedRef.current) return;
      if(isFetchingRef.current) return;
      if(articleLengthRef.current >= totalResultsRef.current) return;
      if(window.innerHeight + window.scrollY + 1 < document.documentElement.scrollHeight) return;
      throttledScroll();
   }
   useEffect(() => {
    window.addEventListener("scroll", monitorScroll);
    updateNews();

    return ()=>{
      window.removeEventListener("scroll", monitorScroll);
      isFetchingRef.current = false;
    };
   }, []);

   useEffect( () => {
    window.scrollTo(0, 0);
   }, [props.category]);

   useEffect( () => {
    articlesRef.current=articles;
    loadingRef.current=loading;
    pageRef.current=page;
    totalResultsRef.current=totalResults;
    articleLengthRef.current=articleLength;
   }, [articles, loading, page, totalResults, articleLength]);

   useEffect( () => {
    isError426Ref.current=isError426;
    isRateLimitedRef.current=isRateLimited;
    isNoResponseRef.current=isNoResponse;
   }, [isError426, isRateLimited, isNoResponse]);

   useEffect(() => {
    props.setProgress(100);
   }, [totalResults]);

   useEffect(() => {
    if(loading===false) isFetchingRef.current=false;
   }, [loading]);
   
    return (
      <>
        <div className="container my-3">
          <h1 className="text-center">NewsPanda - Latest {capitalizeFirstLetter(props.category)} Headlines</h1>
          {<div className="row my-4">
            {
              articles.map((elements)=>{
                if(!elements.title) elements.title="";
                if(!elements.description) elements.description="";
                if(!elements.author) elements.author="Unknown";
                if (!elements.source) elements.source = { name: "Source Unknown" };
                else if(!elements.source.name) elements.source.name="Source Unknown";
                return <div className="col-md-4" key={elements.url || elements.title}>
                  <NewsItem title={elements.title} description={elements.description} imageUrl={elements.urlToImage} newsUrl={elements.url} author={elements.author} publishedAt={elements.publishedAt} name={elements.source.name}/>
                </div>
              })
            }
          </div>}
          {loading && <Spinner/>}
        </div>
      </>
    );
}

News.defaultProps = {
  country: "us"
};

export default News;
