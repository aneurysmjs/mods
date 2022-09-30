# mods

## Instructions

### Workspace

-When you want to call command on particular workspace you should use package name which is set in its package.json file "name". In your case it should be:

```
yarn workspace @mods/NAME_OF_THE_PACKAGE ...
```

-Run a command within the specified workspace.

```
yarn workspace <workspaceName> <commandName> ...
```