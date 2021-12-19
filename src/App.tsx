import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import toast, { Toaster } from 'react-hot-toast';
import solve from './solve';
import './App.scss';

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')

  return (
    <div className={'app'}>
      <Toaster position={'bottom-center'} />
      <h1>HanglishDecoder</h1>
      <form>
        <ul className={'text'}>
          <li>
            <label>
              <span>텍스트</span>
              <textarea
                id='text'
                placeholder='gksrmf'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
          </li>
          <li>
            <label>
              <span>한글</span>
              <textarea
                id='result'
                value={result}
                placeholder='한글'
                disabled={true}
              />
            </label>
          </li>
        </ul>
        <div className='buttons'>
          <button
            className='copy'
            onClick={(e) => {
              e.preventDefault();
              if (result.trim() === '')
                return toast.error(
                  `텍스트가 입력되지 않았습니다!`,
                  {
                    style: {
                      background: '#333',
                      color: '#fff',
                    },
                  }
                );
              copy(result);
              toast.success('결과를 클립보드에 복사했습니다!', {
                style: {
                  background: '#333',
                  color: '#fff',
                },
              });
            }}
          >
            복사
          </button>
          <button
            className='convert'
            onClick={(e) => {
              e.preventDefault();
              setResult(solve(text));
            }}
          >
            디코딩
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
