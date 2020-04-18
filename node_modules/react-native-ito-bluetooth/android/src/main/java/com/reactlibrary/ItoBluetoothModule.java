package com.reactlibrary;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.itoapp.DistanceCallback;
import org.itoapp.PublishUUIDsCallback;
import org.itoapp.TracingServiceInterface;
import org.itoapp.strict.service.TracingService;

public class ItoBluetoothModule extends ReactContextBaseJavaModule {

    private static final String LOG_TAG = "ItoBluetoothModule";
    private final ReactApplicationContext reactContext;
    private TracingServiceInterface tracingServiceInterface;
    private DistanceCallback.Stub nativeContactCallback = new DistanceCallback.Stub() {
        @Override
        public void onDistanceMeasurements(float[] distances) {
            Log.d(LOG_TAG, "emitting onDistancesChanged");
            reactContext.
                    getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onDistancesChanged", Arguments.fromArray(distances));
        }
    };
    private ServiceConnection serviceConnection = new ServiceConnection() {
        public void onServiceConnected(ComponentName className,
                                       IBinder service) {
            Log.d(LOG_TAG, "Service connected");
            tracingServiceInterface = TracingServiceInterface.Stub.asInterface(service);
            try {
                Log.d(LOG_TAG, "Registering callback");
                tracingServiceInterface.setDistanceCallback(nativeContactCallback);
            } catch (RemoteException e) {
                Log.e(LOG_TAG, "looks like the service already crashed!", e);
            }
        }

        public void onServiceDisconnected(ComponentName className) {
            Log.d(LOG_TAG, "Service disconnected");
            tracingServiceInterface = null;
        }
    };

    public ItoBluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d(LOG_TAG, "Creating ItoBluetoothModule");
        this.reactContext = reactContext;
        Intent intent = new Intent(reactContext, TracingService.class);
        reactContext.startService(intent);
        bindService();
    }

    //make this method synchronous because it has to return a boolean
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isPossiblyInfected() {
        try {
            return tracingServiceInterface.isPossiblyInfected();
        } catch (RemoteException e) {
            Log.e(LOG_TAG, "Could not get infected status", e);
            return false;
        }
    }

    //make this method synchronous because it has to return a boolean
    @ReactMethod(isBlockingSynchronousMethod = true)
    public int getLatestFetchTime() {
        try {
            return tracingServiceInterface.getLatestFetchTime();
        } catch (RemoteException e) {
            Log.e(LOG_TAG, "Could not get latest fetch time", e);
            return -1;
        }
    }

    @ReactMethod
    public void publishBeaconUUIDs(int from, int to, Callback callback) {
        try {
            tracingServiceInterface.publishBeaconUUIDs(from * 1000L, to * 1000L, new PublishUUIDsCallback.Stub() {
                @Override
                public void onSuccess() {
                    callback.invoke(true);
                }

                @Override
                public void onFailure() {
                    callback.invoke(false);
                }
            });
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void restartTracing() {
        try {
            tracingServiceInterface.restartTracingService();
        } catch (RemoteException e) {
            Log.e(LOG_TAG, "Could not get TracingService", e);
        }
    }

    private void bindService() {
        Log.d(LOG_TAG, "binding service");
        Intent intent = new Intent(reactContext, TracingService.class);
        reactContext.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
    }

    @Override
    public String getName() {
        return "ItoBluetooth";
    }
}
