# React Thumbnail Extractor

React Component to extract thumbnails of a giving video on client side.

Based on [SCRMHub/clientside-video-thumbnails](https://github.com/SCRMHub/clientside-video-thumbnails)


## Demo

[https://antoniopacheco.github.io/react-thumbnail-extractor-demo/](https://antoniopacheco.github.io/react-thumbnail-extractor-demo/)

## Installation

```bash
$ npm install --save react-thumbnail-extractor
```

## Usage

```js
import ThumbnailExtractor from 'react-thumbnail-extractor'

onCapture = (image) => {
    console.log("image captured",image)
}

onComplete = (images) => {
    console.log("capture completed", onComplete)
}

render(){ 
    <ThumbnailExtractor console={this.console} onCapture={this.onCapture} videoFile={this.state.file} />
}
```
## Options
You can pass the following options as props to `ThumbnailExtractor`:

* videoFile : video
* displayImages: Boolean, to render images in the component
* thumbnailsClass: String, class to be added to images
* maxWidth: Integer, max width of the generated thumbnails
* maxHeight: Integer, max height of the generated thumbnails
* count: Integer, number of thumbnails to get extracted from the video, default: 8

The thumbnails will respect the aspect ratio of the video, independently of the maxWidth and maxHeight

## Events
You can pass the following events as props to `ThumbnailExtractor`:

* onBeforeCapture: void, first event called after the parsing of the video started
* onStartCapture: void, event called after video.onloadedmetadata gets triggered (just before it plays)
* onUnsupportedVideo: void, event called on video error
* onCapture: array[images], event called after a new thumbnail is generated, it returns array of all of the images generated so far
* onComplete: array[images], event called after all of the `count` thumbnails got generated.
* onCompleteDetails: event called after all of the `count` thumbnails got generated with the following details: 
```js
{
    thumbnailCount,
    videoDuration,
    videoInterval,
    thumbWidth,
    thumbHeight,
    videoStart
}
```

