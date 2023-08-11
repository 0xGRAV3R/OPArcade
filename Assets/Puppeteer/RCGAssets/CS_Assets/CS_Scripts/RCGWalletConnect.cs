using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using UnityEngine.Networking;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

public class RCGWalletConnect : MonoBehaviour
{
    private string apiUrl = "";
    private float elapsed = 0f;
    private string address = "";
    // Start is called before the first frame update
    [DllImport("__Internal")]
    private static extern string connectWalletJS();
    [DllImport("__Internal")]
    private static extern bool checkConnectedJS();

    public Text WalletAddress;
    public Text CreditAmount;

    void Start()
    {
        bool connected = checkConnectedJS();
        if (connected) {
            address = PlayerPrefs.GetString("address");
            WalletAddress.text = address.Substring(0, 6) + "...." + address.Substring(address.Length - 6);
            LoadCredit();
        }
    }

    // Update is called once per frame
    void Update()
    {
        // get user's credit amount
        elapsed += Time.deltaTime;
        if (elapsed >= 3f) {
                elapsed = elapsed % 3f;
                LoadCredit();
        }
    }

    public void ConnectWallet() {
        connectWalletJS();
    }

    public void GetWalletInfo(string data) {
        if (data != "none" && data.Length > 10) {
            WalletAddress.text = data.Substring(0, 6) + "...." + data.Substring(data.Length - 6);
            address = data;
            PlayerPrefs.SetString("address", data);
        }
    }

    void LoadCredit() 
    {
        if (address != "")
        {
            StartCoroutine (GetCredit());
        }
    }

    private IEnumerator GetCredit()
    {
        string get_url = apiUrl + "getUserCredit?" + "address=" + address;
        UnityWebRequest hs_get = UnityWebRequest.Get(get_url);
        yield return hs_get.SendWebRequest();
        if (hs_get.error != null) {
            Debug.Log("Get Error");
        } else {
            Debug.Log("Get Success");
            string dataText = hs_get.downloadHandler.text;
            JObject json = JObject.Parse(dataText);
            CreditAmount.text= json["credits"].ToString();
        }
    }
}
