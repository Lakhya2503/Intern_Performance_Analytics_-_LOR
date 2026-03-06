  import axios from 'axios';
import { globalLoading } from '../utils/globalLoading.js';
import { LocalStorage } from '../utils/index.js';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI || "http://localhost:5002/api/lor/v1",
  withCredentials: true, // sends cookies (refresh token)
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------- REQUEST INTERCEPTOR ----------------------

apiClient.interceptors.request.use(
  (config) => {
    globalLoading.start();

    const token = LocalStorage.get("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Remove Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    globalLoading.stop();
    return Promise.reject(error);
  }
);

// ---------------------- RESPONSE INTERCEPTOR ----------------------
apiClient.interceptors.response.use(
  (response) => {
    globalLoading.stop();
    return response;
  },
  async (error) => {
    globalLoading.stop();

    const originalRequest = error.config;

    // If 401 and request has not been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint (httpOnly cookie sent automatically)
        const refreshRes = await apiClient.post("/refresh-token");
        const newAccessToken = refreshRes.data.accessToken;

        // Save new accessToken in localStorage or memory
        LocalStorage.set("accessToken", newAccessToken);

        // Retry the original request with new accessToken
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
  //  ============================================================
  //   AUTH
  //  ============================================================

  export const registerUser =  (formdata) => {
    return apiClient.post("/user/auth/register",formdata)
  }

  export const loggedInUser = (formdata) => {
    return apiClient.post("/user/auth/logged-in", formdata)
  }

  export const loggedOutUser = () => {
    return apiClient.post("/user/auth/logged-out")
  }

  export const tokenRefresh = () => {
    return apiClient.post("/user/auth/token-refresh")
  }

  export const currentUser = () => {
    return apiClient.get("/user/auth/fetch-user")
  }

  export const changeCurrentPassword = (payload) => {
    return apiClient.put("/user/auth/change/current-password",payload)
  }

  export const deleteAccount = () => {
    return apiClient.delete("/user/auth/delete-account")
  }

  //  ============================================================
  //     PROFILE
  //  ============================================================

  export const updateAvatar = (avatar) => {
      return apiClient.post("/user/auth/update-user-profile-avatar", avatar)
  }

  export const updateProfile = (payload) => {
      return apiClient.post("/user/auth/update-user-profile", payload)
  }



  //  ============================================================
  //     EXECUTION TEAM
  //  ( only metnors can access )
  //  ============================================================

  export const changeAuthorization = (excustionTeamId,payload) => {
      return apiClient.post(`/user/auth/update-authorization/${excustionTeamId}`, payload)
  }

  export const executionTeamMembers = () => {
      return apiClient.get(`/user/auth/fetch-execution-team`)
  }


  //  ============================================================
  //     INTERN
  //  (  metnors can access if execution team are authorized other he will not access )
  //  ============================================================


  export const addBulkUploadIntern = (bulkAddInterns) => {
      return apiClient.post(`/intern/bulk-upload/add`, bulkAddInterns)
  }

  export const updateBulkUploadIntern = (bulkUpdateInterns) => {
      return apiClient.post(`/intern/bulk-upload/update`, bulkUpdateInterns)
  }

  export const addSingleIntern = (payload) => {
      return apiClient.post(`/intern/single-intern/add`, payload)
  }

  export const updateSingleIntern = (internId,payload) => {
      return apiClient.put(`/intern/single-intern/update/${internId}`, payload)
  }

  export const scoreRankingInterns = () => {
    return apiClient.get(`/intern/interns-ranking`)
  }

  export const getAllInterns = () => {
     return apiClient.get("/intern/fetch/all-interns")
  }

    export const eligibleInternsForLOR = () => {
         return apiClient.get("/intern/interns-with-no-lor")
    }


  export const allInternsWithNoLor = () => {
      return apiClient.get("/intern/interns-lor-eligible")
  }


  //  ============================================================
  //     LOR
  //  ( only metnors can access )
  //  ============================================================


  export const uploadLorTemplate = (file) => {
      return apiClient.post(`/lor/upload-lor-temp`, file)
  }

  export const generateLorAndSend = (internId, payload) =>{
    return apiClient.post(`/lor/lor-generate/${internId}`,payload)
  }

  export const internsWithLor = () => {
      return apiClient.get(`/lor/fetch/interns-with-lor`)
  }

  export const rejectedInternForLor = () => {
      return apiClient.get(`/lor/fetch/rejected-intern-lor`)
  }

  export const rejectToGenLor = (internId,payload) => {
      return apiClient.post(`/lor/reject/intern/lor-gen/${internId}`,payload)
  }

  export const updateAndSendLor = (internLorId) => {
      return apiClient.put(`/lor/update/send-lor/${internLorId}`)
  }

  export const resendSendEmailLor = (internId) => {
      return apiClient.post(`/lor/resend/lor-email/${internId}`)
  }

  export const bulkUploadInternForGenLor = (bulkInternOfLorGen) => {
    return apiClient.post(`/lor/bulk-upload/interns/lor-gen`, bulkInternOfLorGen)
  }

export const shortListedInternsSelectAndGenLor = (payload) => {
    return apiClient.post(`/lor/select/gen/lor`, payload)
}


//  ============================================================
//     CONTACT
//  ( only sender can access )
//  ============================================================

  export const sendMessage = (payload) => {
        return apiClient.post(`/contact/send-message`, payload)
  }

  export const getMessage = () => {
        return apiClient.get(`/contact/fetch/replied-message`)
  }

  export const deleteMessage = (messagId) => {
        return apiClient.delete(`/contact/delete/message/${messagId}`)
  }


//  ============================================================
//     CONTACT
//  ( only metnors can access )
//  ============================================================


  export const getAllMessagesForMentor = (payload) => {
        return apiClient.get(`/contact/fetch/pending-message`, payload)
  }

  export const replayOfSender = (payload,messagId) => {
        return apiClient.post(`/contact/send/replied-message/${messagId}`, payload)
  }

  export const getSendMessage = () => {
        return apiClient.get(`/contact/fetch/mentor-replay/messages` )
  }


  //  ============================================================
