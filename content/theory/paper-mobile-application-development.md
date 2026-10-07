---
summary: Developing mobile apps — designing the interface with components, setting properties in code, using conditions and loops, using smartphone sensors, and publishing to an app store.
---
# Designing the interface with components
@lo 11.5.4.1@paper

Mobile apps are often built in an **application designer** — e.g. **MIT App Inventor**, Thunkable, Android Studio's layout editor or Xcode — where components are dragged onto a screen.

:::compare Common components
| Component | Purpose |
|---|---|
| Screen | A page of the app |
| Label | Displays text that the user cannot edit |
| TextBox | The user types text or numbers |
| Button | Starts an action when tapped |
| CheckBox / Switch | On/off choice |
| ListPicker / Spinner (drop-down) | Choose one item from a list |
| Image, Canvas | Show pictures; draw |
| Arrangements (horizontal/vertical/table) | Lay out components neatly |
| Notifier | Shows alerts and messages |
| Non-visible: Clock, TinyDB, Sound, Camera, LocationSensor, AccelerometerSensor | Timers, storage, media and sensors |
:::

:::html Interface of a simple tip calculator | 230
<div class="phone">
  <div class="bar">Tip Calculator</div>
  <label>Bill amount</label><input value="12000">
  <label>Tip</label>
  <select><option>10%</option><option selected>15%</option><option>20%</option></select>
  <label class="chk"><input type="checkbox" checked> Round up</label>
  <button>Calculate</button>
  <p class="res">Total: 13 800 ₸</p>
</div>
---css---
body { font-family: Arial; font-size: 13px; }
.phone { width: 220px; border: 2px solid #333; border-radius: 18px; padding: 10px; }
.bar { background: #1f4fd8; color: #fff; padding: 6px; border-radius: 8px; margin-bottom: 6px; text-align: center; }
label { display: block; margin-top: 5px; }
input, select { width: 100%; box-sizing: border-box; }
.chk { display: flex; gap: 4px; }
.chk input { width: auto; }
button { width: 100%; margin-top: 8px; background: #1f4fd8; color: #fff; border: 0; padding: 6px; border-radius: 6px; }
.res { font-weight: bold; text-align: center; }
:::

# Editing component properties in code
@lo 11.5.4.2@paper

Every component has **properties** (Text, BackgroundColor, Visible, Enabled, FontSize, Image) that can be set in the designer **or changed by code** while the app runs, usually inside **event handlers**.

```text | App Inventor blocks written as text
when ButtonCalculate.Click
    set LabelResult.Text to "Total: " + (TextBill.Text * 1.15)
    set LabelResult.TextColor to Blue
    set ButtonCalculate.Enabled to false
```

```kotlin | The same in Android (Kotlin)
buttonCalculate.setOnClickListener {
    val bill = textBill.text.toString().toDouble()
    labelResult.text = "Total: ${bill * 1.15}"
    labelResult.setTextColor(Color.BLUE)
    buttonCalculate.isEnabled = false
}
```

# Using conditional operators
@lo 11.5.4.3@paper

```text | Validation and decisions in an event handler
when ButtonLogin.Click
    if TextPIN.Text = ""
        call Notifier.ShowAlert "Enter your PIN"
    else if length(TextPIN.Text) ≠ 4
        call Notifier.ShowAlert "PIN must have 4 digits"
    else if TextPIN.Text = TinyDB.GetValue("pin")
        open another screen "MainScreen"
    else
        set LabelMessage.Text to "Wrong PIN"
```

# Using loop structures
@lo 11.5.4.4@paper

```text | Loops: fill a list and find the total
when ScreenShop.Initialize
    set total to 0
    for each item in global prices
        set total to total + item
    set LabelTotal.Text to "Total: " + total

when ButtonCountdown.Click
    set n to 10
    while n > 0
        add n to ListViewCount.Elements
        set n to n - 1
```

:::tip
In a mobile app a long-running loop **freezes the interface**. For repeated actions over time (animations, countdowns) use a **Clock/Timer** component whose *Timer* event fires every *n* milliseconds.
:::

# Using the technical capabilities of smartphones
@lo 11.5.4.5@paper

:::compare Sensors and features
| Feature | Example use in an app |
|---|---|
| GPS / location sensor | Maps, tracking a run, finding the nearest shop |
| Accelerometer / gyroscope | Shake to refresh, step counter, games controlled by tilting |
| Camera | Scan QR codes and barcodes, take photos |
| Microphone, speech recognition | Voice commands, recording |
| Touchscreen gestures | Swipe, pinch to zoom, drag |
| Bluetooth, NFC | Connect to devices, contactless payment |
| Proximity / light sensors | Turn off the screen during calls, adjust brightness |
| Notifications, vibration | Reminders and alerts |
:::

:::warning
Apps must request **permissions** (camera, location, contacts) and explain why — users should grant only what is needed, and the app must protect the data it collects.
:::

# Publishing the app
@lo 11.5.4.6@paper

:::steps Publishing to an app store (e.g. Google Play)
- **Test** on several devices and screen sizes; fix bugs.
- Build the release file (**APK / AAB** for Android, IPA for iOS) and **sign** it with the developer's key.
- Create a **developer account** (Google Play Console; Apple Developer Program for the App Store).
- Prepare the **store listing**: name, description, icon, screenshots, category, age rating, **privacy policy**.
- Upload the file, set the price (free/paid) and countries.
- The store **reviews** the app; after approval it is **published**.
- Monitor reviews and crash reports; release **updates**.
:::

:::compare Publishing through a store
| Advantages | Disadvantages |
|---|---|
| Millions of potential users; easy installation and updates | Registration fee and store commission on sales |
| Store checks for malware → user trust | Must follow store rules; review can reject the app |
| Payments and analytics provided | Strong competition; visibility is hard |
:::
