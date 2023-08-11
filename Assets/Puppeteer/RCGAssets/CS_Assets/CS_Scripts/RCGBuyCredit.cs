using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;

public class RCGBuyCredit : MonoBehaviour
{
    
    [DllImport("__Internal")]
    private static extern string getTokenBalanceJS();

    [DllImport("__Internal")]
    private static extern string buyCreditJS(string tokenAmount);

    public Text Balance;
    public Text TokenAmount;
    public Text CreditAmount;
    public Text ErrorMessage;
    public GameObject CanvasBuyCredit;

    // Start is called before the first frame update

    void OnEnable()
    {
        getTokenBalanceJS();
        ErrorMessage.text = "";
    }

    public void setTokenBalance(string data) 
    {
        Balance.text = data;
    }

    // Update is called once per frame
    void Update()
    {
        float result = 0;
		if (float.TryParse(CreditAmount.text, out result)) {
            TokenAmount.text = "Token Amount: " + (result * 4).ToString();
		} else {
			TokenAmount.text = "invalid amount";
		}
    }

    public void BuyCredit()
    {
        float result;
        if (float.TryParse(CreditAmount.text, out result)) {
            ErrorMessage.color = Color.yellow;
            ErrorMessage.text = "Waiting for your approval of transaction...";
            buyCreditJS((result * 4).ToString());
		} else {
            ErrorMessage.color = Color.red;
            ErrorMessage.text = "Invalid input value";
        }
    }

    public void SuccessBuy(string status)
    {
        string[] splitData = Regex.Split(status, @":");
        if (splitData[0] == "success") {
            ErrorMessage.color = Color.green;
            ErrorMessage.text = "Successfully purchased!\nTransactionID:" + splitData[1];
        } else {
            ErrorMessage.color = Color.red;
            ErrorMessage.text = "Error!";
        }
    }
}
