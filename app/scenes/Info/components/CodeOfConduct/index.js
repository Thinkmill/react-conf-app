//
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';

import theme from '../../../../theme';
import Modal from '../../../../components/Modal';

class BulletPoint extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text style={this.props.style}>{'\u2022'}</Text>
        <Text style={[this.props.style, { flex: 1, paddingLeft: 5 }]}>
          {this.props.children}
        </Text>
      </View>
    );
  }
}

export default class CodeOfConduct extends Component {
  render() {
    const { onClose } = this.props;

    return (
      <Modal
        onClose={onClose}
        ref="modal"
        align="bottom"
        style={{ margin: 30 }}
        forceDownwardAnimation
      >
        <View style={styles.wrapper}>
          <ScrollView contentContainerStyle={styles.content}>
            <View>
              <Text style={[styles.heading, styles.heading1]}>
                Code of Conduct
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                As contributors and maintainers of this project, and in the
                interest of fostering an open and welcoming community, we pledge
                to respect all people who contribute through reporting issues,
                posting feature requests, updating documentation, submitting
                pull requests or patches, and other activities.
              </Text>
            </View>
            <View>
              <Text style={styles.text}>
                We are committed to making participation in this project a
                harassment-free experience for everyone, regardless of level of
                experience, gender, gender identity and expression, sexual
                orientation, disability, personal appearance, body size, race,
                ethnicity, age, religion, or nationality.
              </Text>
              <Text style={styles.text}>
                Examples of unacceptable behavior by participants include:
              </Text>
              <BulletPoint style={styles.bulletPoint}>
                The use of sexualized language or imagery
              </BulletPoint>
              <BulletPoint style={styles.bulletPoint}>
                Personal attacks
              </BulletPoint>
              <BulletPoint style={styles.bulletPoint}>
                Trolling or insulting/derogatory comments
              </BulletPoint>
              <BulletPoint style={styles.bulletPoint}>
                Public or private harassment
              </BulletPoint>
              <BulletPoint style={styles.bulletPoint}>
                Publishing other's private information, such as physical or
                electronic addresses, without explicit permission
              </BulletPoint>
              <BulletPoint style={styles.bulletPoint}>
                Other unethical or unprofessional conduct.
              </BulletPoint>
              <Text style={styles.text}>
                Project maintainers have the right and responsibility to remove,
                edit, or reject comments, commits, code, wiki edits, issues, and
                other contributions that are not aligned to this Code of
                Conduct. By adopting this Code of Conduct, project maintainers
                commit themselves to fairly and consistently applying these
                principles to every aspect of managing this project. Project
                maintainers who do not follow or enforce the Code of Conduct may
                be permanently removed from the project team.
              </Text>
              <Text style={styles.text}>
                This code of conduct applies both within project spaces and in
                public spaces when an individual is representing the project or
                its community.
              </Text>
              <Text style={styles.text}>
                Instances of abusive, harassing, or otherwise unacceptable
                behavior may be reported by opening an issue or contacting one
                or more of the project maintainers.
              </Text>
              <Text style={styles.text}>
                This Code of Conduct is adapted from the Contributor Covenant,
                version 1.2.0, available from{' '}
                <Text
                  style={styles.link}
                  onPress={() => {
                    Linking.openURL(
                      'http://contributor-covenant.org/version/1/2/0/'
                    );
                  }}
                >
                  http://contributor-covenant.org/version/1/2/0/
                </Text>
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => this.refs.modal.onClose()}
            style={styles.close}
            activeOpacity={0.75}
          >
            <Icon
              color={theme.color.gray40}
              name="ios-arrow-down"
              size={24}
              style={{ height: 16, marginTop: -6 }}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const BORDER_RADIUS = 6;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS,
    maxHeight: 400,
    shadowColor: 'black',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5
  },
  content: {
    padding: theme.fontSize.default
  },

  // text
  text: {
    color: theme.color.gray60,
    fontSize: 13,
    lineHeight: theme.fontSize.default,
    marginTop: theme.fontSize.small
  },
  bulletPoint: {
    color: theme.color.gray60,
    fontSize: 13,
    lineHeight: theme.fontSize.default
  },
  link: {
    color: theme.color.blue,
    textDecorationLine: 'underline'
  },
  heading: {
    color: theme.color.gray70,
    fontSize: theme.fontSize.small,
    fontWeight: 'bold'
  },
  heading1: {
    fontSize: theme.fontSize.default
  },
  heading2: {
    fontSize: theme.fontSize.small,
    marginTop: theme.fontSize.large
  },

  // close
  close: {
    alignItems: 'center',
    backgroundColor: theme.color.gray05,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    height: 40,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { height: -1, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 0
  },
  closeText: {
    color: theme.color.gray40,
    fontWeight: '500'
  }
});
