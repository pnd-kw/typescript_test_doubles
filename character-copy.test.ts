// Test doubles
//  - fakes
//  - stubs
//  - mocks

import { Copier, Destination, Source } from "./character-copy";

describe('character-copy', () => {
    describe('copy', () => {
        describe('no character before newline', () => {
            test('', () => {
                // Arrange
                const source = createSource([]);
                const destination = createDestination();
                const sut = createCopier(source, destination);
                // Act
                sut.copy();
                // Assert
                expect(destination.writeChar).toHaveBeenCalledTimes(0);
            })
        })

        describe('one character with newline', () => {
            test.each([
                { char: 'a' },
                { char: 'b' },
                { char: '!' }
            ])('char: $char', ({ char }) => {
                // Arrange
                const source = createSource([char]);
                const destination = createDestination();
                const sut = createCopier(source, destination);
                // Act
                sut.copy();
                // Assert
                expect(destination.getWrittenChars()).toContain(char);
            })
        })

        describe('multiple characters with newline', () => {
            test.each([
                { chars: ['a', 'b'] },
                { chars: ['d', 'e', 'f'] },
                { chars: ['!', '$', '#', 'n', 'p'] },
                { chars: ['a', 'a', 'a', 'b', 'c'] },
            ])('chars: $chars', ({ chars }) => {
                // Arrange
                const source = createSource(chars);
                const destination = createDestination();
                const sut = createCopier(source, destination);
                // Act
                sut.copy();
                // Assert
                chars.map(c => expect(destination.getWrittenChars()).toContain(c));
            })
        })

        describe('multiple characters are written in the correct order', () => {
            test.each([
                { chars: ['a', 'b', 'b', 'c', 'a', 'b'] },
            ])('chars: $chars', ({ chars }) => {
                // Arrange
                const source = createSource(chars);
                const destination = createDestination();
                const sut = createCopier(source, destination);
                // Act
                sut.copy();
                // Assert
                expect(destination.getWrittenChars()).toStrictEqual(chars);
            })
        })

        describe('characters after newline are not written', () => {
            test.each([
                { chars: ['z', 't', '\n', 'd', 'h', 'b'], expected: ['z', 't'] },
                { chars: ['z', 't', 'd', '\n', 'b'], expected: ['z', 't', 'd'] },
            ])('chars: $chars', ({ chars, expected }) => {
                // Arrange
                const source = createSource(chars);
                const destination = createDestination();
                const sut = createCopier(source, destination);
                // Act
                sut.copy();
                // Assert
                expect(destination.getWrittenChars()).toStrictEqual(expected);
            })
        })

        function createSource(chars: string[]) {
            const mockReadChar = jest.fn();
            mockReadChar.mockReturnValue('\n');
            chars.map(c => mockReadChar.mockReturnValueOnce(c));
            return {
                readChar: mockReadChar
            };
        }

        function createDestination() {
            const writtenChars: string[] = [];
            return {
                writeChar: jest.fn((c) => writtenChars.push(c)),
                getWrittenChars: () => writtenChars
            };
        }

        function createCopier(source: Source, destination: Destination) {
            return new Copier(source, destination);
        }
    })

})