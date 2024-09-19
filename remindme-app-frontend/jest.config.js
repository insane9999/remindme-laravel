module.exports = {
    preset: 'ts-jest', // Ensure TypeScript is properly configured
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest', // Use babel-jest to transform JS/TSX files
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transformIgnorePatterns: [
        '/node_modules/', // Don't transform node_modules, except for specific packages
    ],
};
