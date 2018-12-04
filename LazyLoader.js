import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LazyThumb } from './LazyThumb';

export class LazyLoader extends React.Component {

  componentDidMount () {
     this.getPhotos();
  }

  componentWillMount() {
    this._mounted = true
  }
  componentWillUnmount () {
     this._mounted = false
  }

  constructor() {
    super();

    var {height, width} = Dimensions.get('window');
    this.state = {
      thumbs: [],
      scrolly: 0,
      devicewidth: width,
      deviceheight: height,
      thumbmargin: 3,
      thumbwidth: 0,
      initialThumbsCt: 0,
      scrollHeightFlex: 1,
      scrollHeight: 0,
    }
    this.state.thumbwidth = Math.floor(
      (this.state.devicewidth - this.state.thumbmargin * 4) / 3
    );
    this.state.scrollHeight = Math.floor(
      this.state.deviceheight * this.state.scrollHeightFlex
    );
    this.state.initialThumbsCt = Math.floor(
      this.state.scrollHeight / this.state.thumbwidth
    ) * 3;

    this.handleScroll = this.handleScroll.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
  }

  getPhotos() {
    var thumbs = [];
    let url = "https://jsonplaceholder.typicode.com/photos";
    return fetch(url)
    .then(response=>{
      response.json()
      .then(json=>{
        var ct = 0;
        json.forEach(image=>{
          visible = true;
          if(ct > this.state.initialThumbsCt) visible = false;
          thumbs.push({id: ct, thumb: image.thumbnailUrl, visible: visible, rendered: false});
          ct++;
        })

        this.setState({thumbs: thumbs})
      })
    })
    .catch((error) => {
      console.log('error fetching photo: '+error);
    })
  }

  renderItem() {
    if(!this._mounted) return
    return this.state.thumbs.map((item, index) => {
      if(item.visible) {
        this.state.thumbs[item.id].rendered = true;
        return (
          <LazyThumb
            id={item.id}
            key={item.id}
            thumb={item.thumb}
            width={this.state.thumbwidth}
            devicewidth={this.state.devicewidth}
            margin={this.state.thumbmargin}
          />
        );
      }
    })
  }

  handleScroll(e) {
    if(!this._mounted) return
    let yoffset = e.nativeEvent.contentOffset.y;
    console.log('yoffset: '+yoffset);
    if(yoffset > this.state.scrolly) {
      this.state.scrolly = yoffset;
      console.log('scrolly: '+this.state.scrolly);

      var scrollBottom =
        this.state.scrollHeight + this.state.scrolly;
      var loadThumbsVertCt = Math.floor(
        scrollBottom / (this.state.thumbwidth+this.state.thumbmargin)
      );
      var loadThumbsCt = loadThumbsVertCt*6;
      var loadThumbsCtPlus =
        loadThumbsCt + this.state.initialThumbsCt + 1;
      if(loadThumbsCtPlus>this.state.thumbs.length) {
        loadThumbsCtPlus = this.state.thumbs.length;
      }

      const newThumbs = this.state.thumbs.slice();

      for(i=loadThumbsCt; i<loadThumbsCtPlus; i++) {
        newThumbs[i].visible = true;
      }
      if(this.refs.myRef) this.setState({ thumbs: newThumbs });
    }
  }

  render() {
    const styles = StyleSheet.create({
      scroller: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: this.state.thumbmargin,
        marginTop: this.state.thumbmargin
      }
    });

    return (
      <View ref="myRef" style={{flex: 1.0}}>
        <View style={{
          flex: this.state.scrollHeightFlex-40,
          width: this.state.devicewidth,
        }}>
          <ScrollView
            ref={ref => this.scrollView = ref}
            contentContainerStyle={styles.scroller}
            onScroll={this.handleScroll}
            scrollEventThrottle={0}
            onMomentumScrollEnd={this.handleScroll}
            >
            {this.renderItem()}
          </ScrollView>
        </View>
      </View>
    )
  }

}
