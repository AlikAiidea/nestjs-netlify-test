# Contributing

Your contributions are highly valued and encouraged. Please refer to the [Table of Contents](#table-of-contents) for different ways to contribute and guidelines specific to this project. We appreciate your effort in familiarizing yourself with the relevant section before making your contribution. we look forward to your valuable contributions.

## Table of Contents

- [I Want To Contribute](#i-want-to-contribute)
- [Commit Messages](#commit-messages)
- [Git Flow](#git-flow)

---

### I Want To Contribute

We welcome contributions from the community! To start coding in this project, please follow these steps:

1. Install Prettier extension.
2. Use the `.prettierrc.js` file provided in this project for consistent code formatting.
3. Install TypeScript Import Sorter with the required options by referring to the instructions in the relevant file.
4. Ensure that every code change includes TypeScript documentation (`ts-doc`).
5. Make sure all tests pass by running `npm run test` after making changes.

### Commit Messages

Where:

- `type ` represents the type of the commit, such as `feature`, `style`, `fix`, `refactor`, `document`, or `update`.
- `scope ` denotes the part of the code you're working on, providing a specific context for the changes.
- `50 characters description ` is a concise summary (up to 50 characters) of the changes made.

**Examples:**

- `feature(main): Add server start log message to main file`
- `update(interface): Removed unnecessary properties`
- `refactor(provider): Refactor HiHoliday provider`
- `fix(provider): Fix import of HiHoliday interface`
- `style(root): Add the import sorter json config file`

**Prefixes:**

Choose one of the following prefixes based on the nature of your changes:

- `feature` for adding new features
- `style` for code style changes
- `fix` for bug fixes
- `refactor` for code refactoring
- `document` for documentation updates
- `update` for general updates and improvements

### Git Flow

We use the [Git Flow](https://roalcantara.medium.com/a-guide-to-improve-the-git-hub-flow-and-commits-messages-b495461e1115) branching model. The `main` branch contains the latest stable release, while the `develop` branch contains the latest development changes. All changes should be made in a feature branch, which is then merged into the `develop` branch via a merge request. Once the `develop` branch has accumulated enough changes, it is merged into the `main` branch and tagged with a release number.

### Versioning

In order to streamline the contribution process and maintain a structured codebase, we have established a guideline for creating branches based on version tags. When working on a specific tag, we recommend creating a new branch using the following naming convention: `git checkout -b version/v[version number]`. Replace `[version number]` with the corresponding version you are working on, ensuring to include the "v" prefix. This naming convention helps in easily identifying and tracking changes related to specific versions of the project. Once you have made your modifications, commit the changes to the branch, providing a clear and informative commit message. This approach allows for efficient collaboration and ensures that changes are properly attributed to their respective versions, contributing to the overall stability and organization of the project.

</br>

## Please ensure that your commits adhere to this format to maintain consistency and clarity throughout the project.

We greatly appreciate your interest in contributing to the "Provider Base" project. Thank you for your valuable contributions and helping us improve the project!
