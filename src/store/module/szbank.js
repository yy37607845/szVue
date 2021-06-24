import { getDpData } from '@/api/szbank'

export default {
    state: {
        //userName:''
      },
      mutations: {
        // setUserName (state, name) {
        //     state.userName = name
        //   }
      },
      actions: {
        getListData({commit},{userName}){
            return new Promise((resolve, reject) => {
                try{
                    getDpData(userName).then(res => {
                        resolve(res)
                    })
                } catch (error) {
                    reject(error)
                  }
            })
        }
      }
}