import '../../styles/NewsPage.scss';

function Loading() {
    return ( <>
    {/* <div className='loadingBox'> */}
        <div className="loading">
            <p>최신 뉴스를 불러오는 중...</p>
            <img src={process.env.PUBLIC_URL + "/loading.gif"} alt="" />
        </div>
    {/* </div> */}
    </> );
}

export default Loading;