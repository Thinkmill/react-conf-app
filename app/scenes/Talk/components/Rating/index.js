import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Constants } from 'expo';
import { TextInput, AsyncStorage, ActivityIndicator } from 'react-native';
import StarRating from 'react-native-star-rating';
import Button from 'react-native-button';
import { selectors, actions } from '../../../../redux/index';
import Avatar from '../../../../components/Avatar';
import DraggableView from '../../../../components/DraggableView';
import Modal from '../../../../components/Modal';
import theme from '../../../../theme';
import { attemptToOpenUrl } from '../../../../utils';
import Raven from 'raven-js';
import isset from '../../../../utils/isset';

import {
  PixelRatio,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const mapStateToProps = (state, props) => ({
  rating: selectors.ratingForTalk(props.talk.title)(state)
});
const mapDispatchToProps = {
  storeRating: actions.storeRating
};

class Rating extends PureComponent {
  static defaultProps = {
    onPress() {}
  };

  constructor(props) {
    super(props);
    const { rating } = props;
    this.state = {
      starCount: isset(() => rating.starCount) ? rating.starCount : 0,
      comment: isset(() => rating.comment) ? rating.comment : '',
      isSaving: false,
      isError: false
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  handleClose = () => {
    this.refs.modal.onClose();
  };

  render() {
    const { onClose } = this.props;

    return (
      <Modal onClose={onClose} ref='modal' forceDownwardAnimation={false}>
        <DraggableView
          style={styles.wrapper}
          allowX={false}
          onRelease={this.handleClose}
        >
          {this.renderInnerView()}
        </DraggableView>
      </Modal>
    );
  }

  renderInnerView() {
    const { talk } = this.props;
    const { isSaving, isError } = this.state;

    return (
      <View style={styles.main}>
        <Text style={styles.mainTitle}>Please submit your rating:</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={this.state.starCount}
          selectedStar={rating => this.onStarRatingPress(rating)}
        />

        <TextInput
          style={{
            height: 40,
            marginTop: 20,
            padding: 5,
            width: '100%',
            borderColor: 'gray',
            borderWidth: 1
          }}
          placeholder='Comment'
          onChangeText={comment => this.setState({ comment })}
          value={this.state.comment}
        />

        <Button
          containerStyle={{
            marginTop: 20,
            padding: 10,
            width: '100%',
            height: 45,
            overflow: 'hidden',
            borderRadius: 4,
            backgroundColor: isError ? theme.color.yellow : theme.color.blue
          }}
          disabledContainerStyle={{
            backgroundColor: theme.color.gray20
          }}
          disabled={!this.state.starCount || isSaving}
          style={{ fontSize: 20, color: 'white' }}
          onPress={this.handleSubmitRating}
        >
          {isSaving ? (
            <ActivityIndicator />
          ) : isError ? (
            'Transmission error. Retry!'
          ) : (
            'Submit rating!'
          )}
        </Button>

        <TouchableOpacity
          onPress={this.handleClose}
          activeOpacity={0.5}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: 44,
            width: 44,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon color={theme.color.gray40} name='md-close' size={24} />
        </TouchableOpacity>
      </View>
    );
  }

  handleSubmitRating = () => {
    this.setState({ isSaving: true });
    fetch('https://neoscon-app.cloud.sandstorm.de/submit-rating', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating: {
          talkTitle: this.props.talk.title,
          rating: this.state.starCount,
          comment: this.state.comment,
          deviceId: Constants.deviceId
        }
      })
    }).then(
      result => {
        if (result.ok) {
          this.props.storeRating(
            this.props.talk.title,
            this.state.starCount,
            this.state.comment
          );
          this.handleClose();
        } else {
          Raven.captureMessage(
            'Rating submission failed with HTTP status ' + result.status
          );
          setTimeout(() => {
            this.setState({ isSaving: false, isError: true });
          }, 500);
        }
      },
      () => {
        Raven.captureMessage('Rating submission failed completely');
        setTimeout(() => {
          this.setState({ isSaving: false, isError: true });
        }, 500);
      }
    );
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Rating);

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },

  // main
  main: {
    alignItems: 'center',
    padding: theme.fontSize.large
  },
  mainTitle: {
    color: theme.color.text,
    fontSize: theme.fontSize.large,
    fontWeight: '300',
    marginVertical: theme.fontSize.default
  },
  mainText: {
    color: theme.color.text,
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 21,
    textAlign: 'center'
  },

  // buttons
  buttons: {
    overflow: 'hidden',
    flexDirection: 'row'
  },
  buttonTouchable: {
    backgroundColor: 'white',
    flex: 1
  },
  button: {
    alignItems: 'center',
    borderTopColor: theme.color.gray20,
    borderTopWidth: 1 / PixelRatio.get(),
    paddingVertical: theme.fontSize.large
  },
  buttonIcon: {
    color: theme.color.blue
  },
  buttonText: {
    color: theme.color.gray60
  }
});
