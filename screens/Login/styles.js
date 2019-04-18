import { Dimensions } from 'react-native';

export default {
    containerStyle: {
        flex: 1,
        width: Dimensions.get('window').width * 1, 
        justifyContent: "center",
        alignItems: "center",        
    },
}