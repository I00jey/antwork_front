import { deleteWord } from '../../services/apiService';

const Word = ({ wordData }: any) => {
  // console.log(wordData);

  const handleDelete = async (num: number) => {
    // console.log(num);
    const response = await deleteWord({ no: num });
    // console.log(response.success);
    if (response.success) {
      alert('단어가 삭제되었습니다.');
      window.location.href = '/wordBook';
    }
  };
  return (
    <>
      {wordData.map((words: any) => (
        <div className="word-wrapper" key={words.no}>
          <div className="word-description">
            <div className="word-title">{words.title}</div>
            {words.content}
          </div>
          <div
            className="word-delete-btn"
            onClick={() => handleDelete(words.no)}
          >
            <span className="material-symbols-rounded">delete</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default Word;
