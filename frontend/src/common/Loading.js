import React from 'react';

const Loading = () => {
  const loadinWrap = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const loadingDotConent = {
    textAlign: 'center'
  };

  const dotStyle = {
    width: '15px',
    height: '15px',
    margin: '0 5px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'dot-blink 1.4s infinite ease-in-out both'
  };

  const loadingText = {
    color: 'white',
    fontSize: '16px',
    marginTop: '16px'
  };

  const dotStyles = document.createElement('style');
  dotStyles.innerHTML = `
  @keyframes dot-blink {
    0%, 80%, 100% {
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
  }`;
  document.head.appendChild(dotStyles);

  return (
    <div>
      <div style={loadinWrap}>
        <div style={loadingDotConent}>
          <div style={dotStyle}></div>
          <div style={{ ...dotStyle, animationDelay: '0.2s' }}></div>
          <div style={{ ...dotStyle, animationDelay: '0.4s' }}></div>
          <div style={{ ...dotStyle, animationDelay: '0.6s' }}></div>
          <div style={{ ...dotStyle, animationDelay: '0.8s' }}></div>
          <div style={loadingText}>처리 중 입니다... 잠시만 기다려주세요.</div>
        </div>
      </div>
      <div style={loadingText}>처리 중 입니다... 잠시만 기다려주세요.</div>
    </div>
  );
}

export default Loading;