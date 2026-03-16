import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, userLogin, userLogout } from '@/api/employee'
import { getToken, setToken, removeToken,getStoreId, setStoreId, removeStoreId, setUserInfo, getUserInfo, removeUserInfo } from '@/utils/cookies'
import store from '@/store'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import jwtDecode from 'jwt-decode'

export interface IUserState {
  token: string
  name: string
  avatar: string
  storeId: string
  introduction: string
  userInfo: any
  roles: string[]
  username: string
}

@Module({ 'dynamic': true, store, 'name': 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  // @ts-ignore
  public storeId: string = getStoreId() || ''
  public introduction = ''
  public userInfo = {}
  public roles: string[] = []
  public username = Cookies.get('username') || ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_USERINFO(userInfo: any) {
    this.userInfo = { ...userInfo }
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_STOREID(storeId: string) {
    this.storeId = storeId
  }
  @Mutation
  private SET_USERNAME(name: string) {
    this.username = name
    }

  @Action
  public async Login(userInfo: { username: string, password: string, loginType: string }) {
    let { username, password, loginType } = userInfo
    username = username.trim()
    this.SET_USERNAME(username)
    Cookies.set('username', username)
    
    // 根据登录类型调用不同接口
    let res
    if (loginType === 'user') {
      res = await userLogin({ username, password })
    } else {
      res = await login({ username, password })
    }
    const { data } = res

    if (String(data.code) === '1') {
      this.SET_TOKEN(data.data.token)
      setToken(data.data.token)
      
      // 解析Token获取角色
      try {
        const decoded: any = jwtDecode(data.data.token)
        const role = decoded.role || (loginType === 'user' ? 'FAMILY' : 'ADMIN') // 默认值处理
        Cookies.set('role', role)
        
        // 存储用户信息
        const userInfo = { ...data.data, role }
        this.SET_USERINFO(userInfo)
        Cookies.set('user_info', userInfo)
        
        // 如果是管理员，默认角色为 ADMIN
        if (loginType !== 'user' && !decoded.role) {
           Cookies.set('role', 'ADMIN')
        }
      } catch (e) {
        console.error('Token解析失败', e)
        Cookies.set('role', loginType === 'user' ? 'FAMILY' : 'ADMIN')
      }

      return data
    } else {
      return Message.error(data.msg)
    }
  }

  @Action
  public ResetToken () {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async changeStore(data: any) {
    this.SET_STOREID = data.data
    this.SET_TOKEN(data.authorization)
    setStoreId(data.data)
    setToken(data.authorization)
  }

  @Action
  public async GetUserInfo () {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }

    const data = JSON.parse(<string>getUserInfo()) 
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }

    const { roles, name, avatar, introduction, applicant, storeManagerName, storeId='' } = data // data.user
    // roles must be a non-empty array
    // if (!roles || roles.length <= 0) {
    //   throw Error('GetUserInfo: roles must be a non-null array!')
    // }

    this.SET_ROLES(roles)
    this.SET_USERINFO(data)
    this.SET_NAME(name || applicant || storeManagerName)
    this.SET_AVATAR(avatar)
    this.SET_INTRODUCTION(introduction)
  }

  @Action
  public async LogOut () {
    try {
      await userLogout({})
    } catch(e) {
      console.log(e)
    }
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    Cookies.remove('username')
    Cookies.remove('user_info')
    Cookies.remove('role')
    removeUserInfo()
  }
}

export const UserModule = getModule(User)
