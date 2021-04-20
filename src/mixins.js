
export const mixins = {
  data(){
    return{
      sensitiveWords:['update','select','alter','drop','insert','union','delete'],
    }
  },
  methods:{
    getInput(value){
      const {sensitiveWords} = this;
      for(let i in sensitiveWords){
        // 包含某个敏感词汇
        for(let index in value){
          if(JSON.stringify(value[index]).indexOf(sensitiveWords[i])!==-1){
            return {tips:'你所填写中包含SQL注入敏感词汇，请重新填写',value:''}
          }
        }
      }
      return {tips:'',value:value}
    }
  },
}