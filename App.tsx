import {Text, View} from 'react-native';

export default () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 20}}>Hello World</Text>
    </View>
  );
};
