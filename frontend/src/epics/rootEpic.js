import { combineEpics } from "redux-observable";
import {
  fetchArticlesEpic,
  addArticleEpic,
  fetchArticleEpic
} from "./articles";
import {
  loginUserEpic,
  registerUserEpic,
  logoutUserEpic,
  verifyUserEpic,
  userLogoutSuccessEpic,
  removeUserEpic,
  userLoginSuccessEpic,
  fetchUserProfileEpic
} from "./users";
import {
  decodeTokenEpic,
  decodeTokenSuccessEpic,
  cleanTokenEpic
} from "./token";
import { uploadAvatarEpic } from "./avatar";
import { notifierEpic } from "./notifier/notifierEpic";

export default combineEpics(
  fetchArticlesEpic,
  addArticleEpic,
  loginUserEpic,
  decodeTokenEpic,
  decodeTokenSuccessEpic,
  registerUserEpic,
  fetchArticleEpic,
  logoutUserEpic,
  cleanTokenEpic,
  verifyUserEpic,
  userLogoutSuccessEpic,
  removeUserEpic,
  uploadAvatarEpic,
  userLoginSuccessEpic,
  fetchUserProfileEpic,
  notifierEpic
);
