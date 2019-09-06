import React, {Component} from 'react';

export default class ThumbnailExtractor extends Component {
  constructor(props) {
    super(props);
    this.video;
    this.videoHtml;
    this.videoHeight;
    this.videoWidth;
    this.videoDuration;
    this.videoInterval;
    this.videoStart;
    this.completed = 0;
    this.captures = [];
    this.capturesDetailed = {};
    this.events = {};
    this.currentShot = 0;
    this.startTime = null;
    this.lastTime = null;
    this.maxWidth = props.maxWidth || 1280;
    this.maxHeight = props.maxHeight || 1280;
    this.count = props.count || 8;
    this.state = {
        captures: []
    }
  }

  getTime = () => {
    const thisTime = new Date().getTime();
    const diff = thisTime - this.lastTime;
    const fromStart = thisTime - this.startTime;
    this.lastTime = thisTime;
    return {
      diff,
      fromStart,
    };
  };

  cleanUp = () => {
    this.video = null;
    delete this.video;
    this.videoHtml = null;
    delete this.videoHtml;
  }

  grabComplete = (image) => {
    const {onCapture, onComplete, onCompleteDetails} = this.props;
    const counter = this.currentShot;
    this.completed++;

    //Stats are nice
    const statTime = this.getTime();

    //Save it to the array
    this.captures.push(image);
    this.setState({captures: this.captures})
    this.capturesDetailed[counter].url = image;
    this.capturesDetailed[counter].captureTime = statTime.diff;

    //Fire the event incase anyone is listening
    onCapture && onCapture(this.captures);

    //All done so remove the elements
    if (this.completed >= this.count) {
      this.cleanUp();
      onComplete && onComplete(this.captures);
      const stats = this.getTime();
      onCompleteDetails &&
        onCompleteDetails({
          thumbs: this.capturesDetailed,
          totalTime: stats.fromStart,
          details: {
            thumbnailCount: this.count,
            videoDuration: this.videoDuration,
            videoInterval: this.videoInterval,
            thumbWidth: this.thumbWidth,
            thumbHeight: this.thumbHeight,
            videoStart: this.videoStart,
          },
        });
    } else {
      //Prepare the next shot
      this.prepareScreenshot();
    }
  };

  save = (canvas) => {
    //Get the shot
    const theCapture = canvas.toDataURL('image/jpeg', 0.7);
    //done
    this.grabComplete(theCapture);
  };

  /**
   * Capture the shot by using a canvas element
   */
  captureScreenShot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = this.thumbWidth;
    canvas.height = this.thumbHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, this.thumbWidth, this.thumbHeight);
    //and save
    this.save(canvas);
  };

  prepareScreenshot = () => {
    this.currentShot++;
    var newTime = Math.floor(
      this.videoStart +
        this.currentShot * this.videoInterval -
        this.videoInterval
    );
    var statTime = this.getTime();
    this.capturesDetailed[this.currentShot] = {
      capture: this.currentShot,
      width: this.thumbWidth,
      height: this.thumbHeight,
      timeindex: newTime,
      startTime: statTime.fromStart,
      captureTime: null,
    };
    this.video.currentTime = newTime;
  };

  initScreenshot = () => {
    this.thumbWidth = this.video.videoWidth;
    this.thumbHeight = this.video.videoHeight;
    //Wide video
    if (this.thumbWidth > this.thumbHeight) {
      const ratio = this.maxWidth / this.thumbWidth;
      this.thumbWidth = this.maxWidth;
      this.thumbHeight = parseInt(this.thumbHeight * ratio);

      //square video
    } else if (this.thumbWidth === this.thumbHeight) {
      this.thumbWidth = this.maxWidth;
      this.thumbHeight = this.maxHeight;

      //tall video
    } else {
      const ratio = this.maxHeight / this.thumbHeight;
      this.thumbHeight = this.maxHeight;
      this.thumbWidth = parseInt(this.thumbWidth * ratio);
    }

    this.videoHtml.style.width = this.thumbWidth;
    this.videoHtml.style.height = this.thumbHeight;

    this.videoDuration = this.video.duration;
    this.videoInterval = this.videoDuration / (this.count + 1); //this will ensure credits are ignored
    this.videoStart = this.videoInterval / 2;
    //Prepare the next shot
    this.prepareScreenshot();
  };

  parseVideo = () => {
    const {
      videoFile,
      onBeforeCapture,
      onStartCapture,
      onUnsupportedVideo,
    } = this.props;
    onBeforeCapture && onBeforeCapture();
    this.lastTime = this.startTime = new Date().getTime();
    const data = new FormData();
    data.append('file', videoFile, videoFile.name);
    const url = window.URL || window.webkitURL;
    const fileURL = url.createObjectURL(videoFile);
    const videoHtml = document.createElement('video');
    videoHtml.setAttribute('id', 'videoHtmlCapture');
    videoHtml.setAttribute('controls', true);
    videoHtml.setAttribute('preload', 'metadata');
    videoHtml.setAttribute('crossorigin', '*');
    videoHtml.setAttribute('width', '600');
    videoHtml.setAttribute('src', fileURL);

    const theVideo = document.createElement('source');
    theVideo.setAttribute('src', fileURL);
    theVideo.setAttribute('type', videoFile.type);
    videoHtml.innerHTML = theVideo;
    this.videoHtml = videoHtml;
    this.video = this.videoHtml;
    this.video.onloadedmetadata = () => {
      onStartCapture && onStartCapture(this.state.captures);
      this.video.play();
    };
    this.video.onplay = () => {
      this.initScreenshot();
    };
    //Can't play this video
    this.video.onerror = () => {
      onUnsupportedVideo && onUnsupportedVideo();
    };
    this.video.addEventListener('seeked', () => {
      //Check we still have a video (might have been cancelled)
      if (this.video) {
        this.video.pause();
        this.captureScreenShot();
      }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.videoFile !== this.props.videoFile) {
      this.parseVideo();
    }
  }

  render() {
    const {videoFile, displayImages, thumbnailsClass} = this.props;
    if (!videoFile || !displayImages) {
      return null;
    }
    return this.state.captures.map((image, key)=>{
       return <img className={thumbnailsClass} key={`thumbnail_image_${key}`} src={image} />
    })
  }
}
