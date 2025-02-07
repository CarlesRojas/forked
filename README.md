# Forked

## Development

**Run the app on the browser**

```bash
bun dev
```

**Run the app as an electron app**

```bash
bun el:dev
```

**Build the app**

```bash
bun app:build
```

## Steam

**Release Build**

1. Update the package.json version using semver.
2. Run `bun app:build`
3. Copy the files from the `release/{version}` folder to the `SteamWorksSDK\tools\ContentBuilder\content/{version}` folder.
4. Run `SteamWorksSDK\tools\SteamPipeGUI\SteamPipeGUI.exe"`
5. Fill AppId, Steam Login, Steam Password, path to ContentBuilder and path to the `SteamWorksSDK\tools\ContentBuilder\content/{version}` folder.
6. Click on `Generate VDFs`
7. Click on `Build`
8. Get the Guard Code from the steamworks email.
9. On success. Close the SteamPipeGUI.
10. Open the [SteamWorks Build Page](https://partner.steamgames.com/apps/builds), set the new build to the `default` branch and click `Preview Change`.
