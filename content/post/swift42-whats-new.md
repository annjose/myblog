+++
title = "Swift 4.2 - What's New"
date = "2018-10-12T20:09:12-08:00"
tags = ["ios","swift","mobile-tech","tech-explorations"]
topics = ["swift"]
description = "A quick glance at all the goodness in Swift 4.2"
+++

In this post, I would like to share what's new in Swift 4.2. All the code displayed in this post is available at [Swift4_2-WhatsNew.playground](https://github.com/annjose/my-learnings/tree/master/Swift4.2/Swift4_2-WhatsNew.playground).

## Random Number Generation
* Swift 4.2 added random number generator API to standard library. You can use it on `Int`, `Double`, `Float`, `CGFloat` and `Bool`. 
* It also provides a convenient API `randomElement` which returns a random element from a sequence
* It also provides the APIs `shuffle` and `shuffled` to shuffle a sequence

```
let randomInt = Int.random(in: 0..<10)
let randomElement = ["one", "two", "three", "four"].randomElement()
```

## Dynamic Member Lookup
Swift 4.2 introduces a dot syntax to access custom subscripts; this is much cleaner than the earlier square bracket calls. The compiler evaluates the subscript call dynamically at runtime, but provides a cleaner syntax.

In order to use this feature, you have annotate your type with `@dynamicMemberLookup` and implement the method `subscript(dynamicMember:)`

```
@dynamicMemberLookup
class Person {
    let name: String, let age: Int, let details: [String: String]
    
    subscript(dynamicMember key: String) -> String {
        switch key {
        case "info":
            return "\(name) is \(age) years old"
        default:
            return details[key] ?? "unknown"
        }
    }
}
let p = Person(name: "John", age: 34, details: ["title": "Author"])
p.info
```

## Enumeration Case Collections
Swift 4.2 has added enumeration case arrays `allCases` to all enumerations so that you can loop through all the cases of an enumerator without having to define an array of your own with all the cases. Swift does this automatically for you through the protocol. 

If you want to customize the cases that is returned by `allCases`, you can implement the `CaseIterator` yourself.

```
for (index, season) in Season.allCases.enumerated() {
    print ("[\(index)]: \(season.rawValue.capitalized)")
}
```

## Sequence Enhancements
Swift 4.2 made some neat enhancements to the Sequence APIs, for example, `last(where:)`, `lastIndex(of:)`, `lastIndes(where:)`. They also added a new method `allSatisfy(:)` that checks whether all elements in a sequence satisfy a specific condition.

```
let numbers = [11, 14, 91, 12, 43]
numbers.last(where: { $0 % 2 == 0 })    
numbers.lastIndex(where: { $0 % 2 == 0 })

[10, 21, 30].allSatisfy { $0 % 2 == 0 }  // true

```

## Conditional Conformance
Swift 4.2 provides default implementation for conditional conformance to `Equatable`, `Hashable` and `Codable` in extensions. In Swift 4.1, you had to manually implement these protocols even though the conforming protocol provided the implementations.

```
// Swift 4.1 - you have to implement the Equatable for conditional conformance 
extension Screencast: Equatable where Tutorial: Equatable {
    /*static func ==(lhs: Screencast, rhs: Screencast) -> Bool {
       return lhs.author == rhs.author && lhs.tutorial == rhs.tutorial
    }*/
}

// Swift 4.2 - you can just use the default implementation 
extension Screencast: Equatable where Tutorial: Equatable { }
extension Screencast: Equatable where Tutorial: Hashable { }
extension Screencast: Equatable where Tutorial: Codable { }
```

Also, optionals, arrays, dictionaries and ranges are `Hashable` when their elements are `Hashable`.

## Other improvements

* Swift 4.2 provides universal hash functions which enables us to implement custom hash functions for a class much easier, more correct and performant. The `Hashable` protocol defines a new method `hash(into:)` which repalces `hasValue` of Swift 4.1
```
    func hash(into hasher: inout Hasher) {
        hasher.combine(url)
    }
```

* Convenience method to remove elements of a collection that satisfy a condition
```
var nums = [1, 2, 3, 4]
nums.removeAll { $0 % 2 == 0}   // {1, 3}
```

* And finally, Yes! Swift 4.2 adds `toggle` to `Bool`
```
var flipMe = true
flipMe.toggle()
```

## References
* [Ray Wenderlich article](https://www.raywenderlich.com/5357-what-s-new-in-swift-4-2)
* [Hacking With Swift](https://www.hackingwithswift.com/articles/77/whats-new-in-swift-4-2)

## Conclusion

All in all, Swift 4.2 contains many improvements to existing features and adds a few nice new features which makes the language more delightful to work with. This concludes the major enhancements in Swift 4.2. There are a few more enhancements listed in Ray Wenderlich tutorial. If you would like to know more, you can find them at https://www.raywenderlich.com/5357-what-s-new-in-swift-4-2.

It will be really interesting to see how these enhancements will bring Swift closer to ABI stability.