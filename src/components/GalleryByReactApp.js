'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.css');

//获取图片数据
var imageDatas = require('../data/imageDatas.json');
//将图片名信息转换为图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

  /*
  *随机获得图片位置
  */
  function randomPic(low, high){

    return Math.ceil(Math.random() * (high - low) + low);
  }
var ImgFigure = React.createClass({
  render: function(){
    var styleObj = {};
    if(this.props.arrange.pos){
            styleObj = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObj} >
        <img src={this.props.data.imageURL}
          alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
});


var GalleryByReactApp = React.createClass({
  Constant: {
    centerPosition: {
      left: 0,
      top: 0
    },
    hPosRange: {//水平方向范围，左右区域
      leftRangex: [0, 0],
      rightRangex: [0, 0],
      y: [0, 0]
    },
    vPosRange: {//垂直方向范围，上下区域
      topRangey: [0, 0],
      x: [0, 0]
    }
  },

  /*重新排布图片布局
  *@param centerIndex 指定居中图片
  */
  rearrange: function (centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr;
    var centerPosition = this.Constant.centerPosition;
    var hPosRange = this.Constant.hPosRange;
    var leftRangex = hPosRange.leftRangex;
    var rightRangex = hPosRange.rightRangex;
    var hPosRangey = hPosRange.y;
    var vPosRange = this.Constant.vPosRange;
    var topRangey = vPosRange.topRangey;
    var vPosRangex = vPosRange.x;

    var topImg = [];
    // var leftImg = [];
    // var rightImg = [];
    //布局中心图片
    var centerImg = imgsArrangeArr.splice(centerIndex, 1);
    centerImg.pos = centerPosition;
  //上方布局０或者１张图 
    var topNum = Math.ceil(Math.random());
    var topIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topNum));
    topImg = imgsArrangeArr.splice(topIndex, topNum);
    topImg.forEach(
      function(value, index){
        topImg[index].pos.top = randomPic(topRangey[0], topRangey[1]);
        topImg[index].pos.left = randomPic(vPosRangex[0], vPosRangex[1]);
      }
    );
//布局左右方图片
   for(var k = 0; k < imgsArrangeArr.length; k++){
     if(k % 2 === 0){
       imgsArrangeArr[k].pos = {
         left: randomPic(leftRangex[0], leftRangex[1]),
         top: randomPic(hPosRangey[0], hPosRangey[1])
       };
        // leftImg.push(imgsArrangeArr[k]);
     }
     else
     {
        imgsArrangeArr[k].pos = {
         left: randomPic(rightRangex[0], rightRangex[1]),
         top: randomPic(hPosRangey[0], hPosRangey[1])
       };
      //  rightImg.push(imgsArrangeArr[k]);
     }
   }
   //将剔除掉的图片加回
   if(topNum !== 0){
     imgsArrangeArr.splice(topIndex, 0, topImg[0]);
   }

   imgsArrangeArr.splice(centerIndex, 0, centerImg);
   this.setState({//触发重新渲染
     imgsArrangeArr: imgsArrangeArr
   });
  },
  getInitialState: function () {
    return {
      imgsArrangeArr: [
        // {
        //   pos: {
        //     left: 0,
        //     top: 0
        //   }
        // }
      ]
    };
  },
  componentDidMount: function () {
    //获取舞台的长宽
    var stageDOM = React.findDOMNode(this.refs.stage);
    var stageW = stageDOM.scrollWidth;
    var stageH = stageDOM.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2);
    var halfStageH = Math.ceil(stageH / 2);
    //获取图片的长宽
    var ImgFigureDOM = React.findDOMNode(this.refs.imgFigure0);
    var imgFigureH = ImgFigureDOM.scrollHeight;
    var imgFigureW = ImgFigureDOM.scrollWidth;
    var halfImgFigureW = Math.ceil(imgFigureW / 2);
    var halfImgFigureH = Math.ceil(imgFigureH / 2);
    //计算区域范围
    //计算中心图片位置点
    this.Constant.centerPosition = {
      left: halfStageW - halfImgFigureW,
      top: halfStageH - halfImgFigureH
    };
    //计算左侧右侧区域排布范围
    this.Constant.hPosRange = {
      leftRangex: [0 - halfImgFigureW, halfStageW - halfImgFigureW * 3],
      rightRangex: [halfStageW + halfImgFigureW, stageW - halfImgFigureW],
      y: [0 - halfImgFigureH, stageH - halfImgFigureH]
    };
    //计算上侧区域排布范围
    this.Constant.vPosRange = {
      topRangey: [0 - halfImgFigureH, halfStageH - halfImgFigureH * 3],
      x: [halfImgFigureW - halfStageW, halfImgFigureW]
    };

    this.rearrange(0);
  },
  render: function () {
    var controllerUnits = [];
    var imgFigures = [];
    imageDatas.forEach(
      function (element, index) {
        if (!this.state.imgsArrangeArr[index]) {
          this.state.imgsArrangeArr[index] = {
            pos: {
              left: 0,
              top: 0
            }
          };
        }
        imgFigures.push(<ImgFigure data={element} ref={'imgFigure' + index}arrange={this.state.imgsArrangeArr[index]}/>);
      }.bind(this));
    return (<section className = "stage" ref="stage">
      <section className = "img-sec">
        {imgFigures}
      </section>
      <nav className = "controller-nav">
        {controllerUnits}
      </nav>
    </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
