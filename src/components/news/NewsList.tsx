import { Link } from "react-router-dom";
import { NewsProp } from "../../types/NewsProp";
import '../../styles/NewsPage.scss';

interface NewsListProp {
    data: NewsProp;
  }

function NewsList({data}: NewsListProp) {
    // console.log('data >',data)
    return ( <>
     <Link to={`/news/detail/${data._id}`}>
         <article>
            <div className="newsData">
                <div className="dataImgCover">
                <img className="dataImg" src={data.smallimg || process.env.PUBLIC_URL + "/Group 51.png"} alt={data.title} />
                </div>

                <div className="dataTxt">
                    <p className="dataTitle">{data.title}</p>
                    <p className="dataContent">{data.content}</p>
                    <p className="dataDate">{data.date}</p>
                </div>
                
            </div>
         </article>
     </Link>
    </> );
}

export default NewsList;