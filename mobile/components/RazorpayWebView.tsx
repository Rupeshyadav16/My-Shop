import React, { useState } from "react";
import { Modal, View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  name: string;
  onSuccess: (paymentData: any) => void;
  onFailure: (error: any) => void;
  onClose: () => void;
}

const RazorpayWebView = ({ orderId, amount, currency, keyId, name, onSuccess, onFailure, onClose }: Props) => {
  const [loading, setLoading] = useState(true);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </head>
    <body style="background:#121212; display:flex; justify-content:center; align-items:center; height:100vh;">
      <script>
        var options = {
          key: "${keyId}",
          amount: "${amount}",
          currency: "${currency}",
          name: "${name}",
          order_id: "${orderId}",
          handler: function(response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              success: true,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }));
          },
          modal: {
            ondismiss: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ dismissed: true }));
            }
          },
          theme: { color: "#1DB954" }
        };
        var rzp = new Razorpay(options);
        rzp.on("payment.failed", function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            success: false,
            error: response.error.description
          }));
        });
        rzp.open();
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.success) {
      onSuccess(data);
    } else if (data.dismissed) {
      onClose();
    } else {
      onFailure(data.error);
    }
  };

  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#121212" }}>
        <TouchableOpacity
          onPress={onClose}
          style={{ padding: 16, alignItems: "flex-end" }}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>✕ Close</Text>
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#1DB954"
            style={{ position: "absolute", top: "50%", left: "50%", marginLeft: -20 }}
          />
        )}
        <WebView
          source={{ html }}
          onMessage={handleMessage}
          onLoad={() => setLoading(false)}
          javaScriptEnabled={true}
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
};

export default RazorpayWebView;