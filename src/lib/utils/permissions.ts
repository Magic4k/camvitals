interface PermissionResult {
  camera: boolean;
  notifications: boolean;
  loading: boolean;
  done: boolean;
}

export async function requestPermissions(userName: string): Promise<PermissionResult> {
  try {
    // Request camera permission
    const cameraPermission = await navigator.mediaDevices.getUserMedia({ video: true });
    // Stop the video stream immediately after getting permission
    cameraPermission.getTracks().forEach(track => track.stop());

    // Request notification permission
    const notificationPermission = await Notification.requestPermission();
    
    // Show welcome notification if permission granted
    if (notificationPermission === "granted") {
      const welcomeNotification = new Notification("Welcome to CamVitals! 👋", {
        body: `Great to see you, ${userName}! Your wellness journey continues.`,
        icon: "/logo.png",
        badge: "/logo.png",
        tag: "welcome",
      });

      // Close notification after 5 seconds
      setTimeout(() => welcomeNotification.close(), 5000);
    }

    return {
      camera: true,
      notifications: notificationPermission === "granted",
      loading: false,
      done: true
    };
  } catch (error) {
    console.error("Error requesting permissions:", error);
    return {
      camera: false,
      notifications: Notification.permission === "granted",
      loading: false,
      done: true
    };
  }
} 