/**
 * 加密
 */
import CryptoJS from 'crypto-js'

const key = "31323334353637383930414243444546" //秘钥
const keyC = CryptoJS.enc.Hex.parse(key)
const iv = CryptoJS.enc.Hex.parse("31323334353637383930414243444546") 
const EncryptionPSW = (params,PasswrodEncrypted) =>{ 
	let encyParasms = {}
	if(PasswrodEncrypted === "0"){
		encyParasms = params
	}else{
		for(let key in params){
			const encValue = CryptoJS.AES.encrypt(params[key] ,keyC,{
				iv:iv,
				mode: CryptoJS.mode.CBC,  
				padding: CryptoJS.pad.Pkcs7
			})
			encyParasms[key] = encValue.ciphertext.toString()
		}
	}
	
	return encyParasms
}

export default EncryptionPSW