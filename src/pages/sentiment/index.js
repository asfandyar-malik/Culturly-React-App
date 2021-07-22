import sentimentImg from "assets/images/sentiment-purple.png";

import "./style.scss";

const Sentiment = () => {

  return (
    <div className="sentiment-page">
      <div className="body">
        <div>
          {/* <p className="text-3xl medium mt-12">
            Sentiment score for your team
          </p>
          <p className="text-xl mb-16">
            Anonymous Sentiment analysis from the open ended survey questions 
          </p> */
          }
          <div className="images-list">
            <img src={sentimentImg} alt="Sentiment" />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Sentiment;