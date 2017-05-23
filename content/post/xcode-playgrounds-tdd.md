+++
date = "2017-04-02T02:02:31-07:00"
title = "TDD in Xcode Playground"
categories = [
  "Mobile Development",
  "iOS"
]
+++

I use Xcode playground a lot in order to write code snippets - either to try out something that I read in a blog, or to demonstrate a code improvement that I want to suggest in a code review, or sometimes even to prototype a design before doing the full-blown implementation in Xcode project. During this experimentation phase, the correctness of the code was verified by analyzing the ouput displayed on the right-hand side column of the playground. This was really cumbersome and error-prone and I was hoping that there would be a better solution for this.

No wonder why I was really excited when I learned about a simple trick that enables us to write unit tests in Xcode playground itself. Yes! We can do TDD in Xcode Playgrounds! Let's see how to do it.

Essentially, the trick is as follows - you create a regular test class that derives from XCTestCase and run it using Xcode's default test suite `defaultTestSuite()`. This is the test suite that contains the test cases for all the tests in the class (https://developer.apple.com/reference/xctest/xctestcase/1496289-defaulttestsuite). So all you need to do is write a test class and invoke `defaultTestSuite().run()` on the test class.

Here is an example:

```
import Foundation
import XCTest

var str = "Hello, playground"

struct TodoItem {
    let title: String
    let toBeCompletedBy: Date?
    
    init(title: String) {
        self.title = title
        self.toBeCompletedBy = nil
    }
}

class TodoTests: XCTestCase {
    
    func testTodo() {
        let todo = TodoItem(title: "finish laundry")
        XCTAssertNotNil(todo)
        XCTAssertEqual(todo.title, "finish laundry")
    }
    
}

TodoTests.defaultTestSuite().run()
```


This will execute all the tests in the test class and display the results in the familiar Xcode test format as folllows:

```
Test Suite 'TodoTests' started at 2017-04-02 01:36:16.888
Test Case '-[__lldb_expr_49.TodoTests testTodo]' started.
Test Case '-[__lldb_expr_49.TodoTests testTodo]' passed (0.004 seconds).
Test Suite 'TodoTests' passed at 2017-04-02 01:36:16.894.
	 Executed 1 test, with 0 failures (0 unexpected) in 0.004 (0.006) seconds
```

Now you can write your code snippets and tests side-by-side and verify the results using the tests. The ultimate beauty of this approach is that these tests are run automatically whenever you make changes in the class-under-test, thanks to Xcode playground's auto-refresh capability.

So where did I learn this from? Initially, I read about this concept from the [blog initWithStyle](http://initwithstyle.net/2015/11/tdd-in-swift-playground) where the author implemented a slightly complex solution that creates `PlaygroundTestObserver`, `TestRunner` and connected it to the Playground's `XCTestObservationCenter`. But recently I read another [blog post](https://m.pardel.net/tdd-in-xcode-playgrounds-544a95db11e2) which proposed a much simple solution as described above.

If you would like to try it out for yourself, here is a simple gist that demonstrates the code - [annjose/XcodePlaygroundUnitTests.swift](https://gist.github.com/annjose/1baa75b0796d0d2fef1a10ab74d5bd65)


