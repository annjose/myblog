+++
title = "How To Mock Network Requests in iOS"
date = "2018-11-17T19:00:52-08:00"
tags = ["ios", "unit testing"]
topics = []
description = "A simple Swift framework for mocking network requests"
+++

One of the challenges of mobile application development is to ensure that the application is resilient to various error responses from the services that are consumed by the application. Mobile devices are more susceptible to network connectivity issues, timeout etc. So we need to take extra care to make sure that we test all error scenarios and handle them in a meaningful manner.

## What and Why of Mocking
Even though we are convinced about the benefits of testing server errors, these services are running in Production serving real customer requests. So it is not possible to make every service API to return these various error responses. So in order to test these scenarios, we need to simulate the server requests locally such that it returns the responses that we want to test. This is what we mean by mocking data requests. These "server" requests will not actually hit the network; the mocking code runs locally and returns the data that corresponds to success or error response.

## So How Do We Mock

Yes. The question is how do we mock these network requests. There are a lot of frameworks and libraries that implement mocking extensions for the iOS networking stack. One such framework I found really interesting is [Mocker](https://github.com/WeTransfer/Mocker). 

## Let's Meet Mocker

Mocker is a very simple Swift framework that allows us to mock all network calls that are initiated through URLSession(dataTask:) or AlamoFire. I love this library because not only was it easy to get started, but it also supports different use cases like handling server redirects. More importantly, the code is really simple and easy to understand, so we can modify or extend the library as needed.

`Mocker` can be integrated using any of the standard tools like Cocoapods, Carthage or manually as a framework. The installation steps are pretty straight-forward and very well described in the [README of Mocker](https://github.com/WeTransfer/Mocker#installation).

The more interesting exercise would be to look under the hood and understand how it works.

## Mocker Under The Hood
The Mocker library is a very light-weight library with just a handful of classes - `Mocker`, `Mock` and `MockingURLProtocol`.

* `Mock` is a simple struct that holds the data that is configured by the test. This includes the URL of the server endpoint, 
HTTP method, response data etc.

* `Mocker` is the class where the mocks can be registered and it holds a reference to the mocks and serve them 
to the tests as needed. Mocker is held as a singleton instance so that other classes can easily use it.

* MockingURLProtocol is the main class where the real magic of mocking happens. 
This class extends the standard `URLProtocol` class and overrides methods like `startLoading`, `canInit`, `canonicalRequest` etc.
to provide a custom implementation based on mocked data. These methods are called during the life cycle of 
`URLSession(dataTask:)` method and thus can be used to inject custom behavior and mock data to return to the caller.

## How Does It Work
The implementation of `startLoading` method asks the singleton instance of `Mocker` to give the instance of `Mock` that 
corresponds to the current `request` object if registered by the test class. The `startLoading` method checks the validity 
of the `Mock` instance and completes the request by calling either the method `URLProtocolClient(didFinishLoading:)`
if the mock is valid or the method `URLProtocolClient(didFailWithError:)` if the mock is nil or invalid.

As a result, `URLSession(dataTask:)` returns with a valid mocked data as requested by the test method. 

## Sample Code

Let's see a few examples of mocking server responses - as success and error - using Mocker library

### Example of Success Response

The following test method is using Mocker to mock the scenario of server returning a success 
response for the API `https://my.service.com/users/me`

```
func test_fetch_user_data_success() {
    let serviceUrl = URL(string: "https://my.service.com/users/me")!

    let responseFile = "Resources/users-api-response-success"
    guard let mockResponse = dataFromTestBundleFile(fileName: responseFile, 
                                                withExtension: "json") else {
        return
    }
    // The contents of the above file is simple JSON like this: { "name": "Ann" }
    
    // Set up the mock to return the test data gathered above
    let mockService = Mock(url: serviceUrl, 
                           dataType: Mock.DataType.json, 
                           statusCode: 200, 
                           data: [Mock.HTTPMethod.get : mockResponse])
    mockService.register()
    
    let exp = expectation(description: "expecting to get success response")
    
    let dataTask = URLSession.shared.dataTask(with: serviceUrl) { 
                            (data, _, error) in
        XCTAssertNil(error)
        
        guard let dataDict = self.verifyAndConvertToDictionary(data: data) else {
            exp.fulfill()
            return
        }

        XCTAssertEqual(dataDict["name"] as? String, "Ann")
        exp.fulfill()
    }
    dataTask.resume()
    
    waitForExpectations(timeout: 2.0, handler: nil)
}
```
You can see the full code of this test at [URLSessionMockerSampleTests.swift](https://github.com/annjose/my-learnings/blob/7b6fe8686cadb40c64319766d59ddfe95db1a7b2/URLSessionMockerSample/URLSessionMockerSampleTests/URLSessionMockerSampleTests.swift#L24).

### Examples of Error Response

You can follow the above approach to mock error response from the server. Here are a few examples:

```
// Set up the mock to return HTTP Error code 401
let mockService = Mock(url: serviceUrl, dataType: Mock.DataType.json, 
                        statusCode: 401, data: [Mock.HTTPMethod.get: emptyData])
mockService.register()

let exp = expectation(description: "exp")

let dataTask = URLSession.shared.dataTask(with: serviceUrl) { 
                        (data, response, _) in
    XCTAssertNotNil(response as? HTTPURLResponse)
    guard let httpResponse = response as? HTTPURLResponse else {
        return
    }
    XCTAssertEqual(httpResponse.statusCode, 401)
    XCTAssertNotNil(data)

    exp.fulfill()
    
}
dataTask.resume()
```

See the full code of this test at [URLSessionMockerSampleTests.swift](https://github.com/annjose/my-learnings/blob/7b6fe8686cadb40c64319766d59ddfe95db1a7b2/URLSessionMockerSample/URLSessionMockerSampleTests/URLSessionMockerSampleTests.swift#L58).


Here is a test that mocks an error response with HTTP code 200, but error details are sent in the response body -
 [test_fetch_user_data_error_unauthorized](https://github.com/annjose/my-learnings/blob/7b6fe8686cadb40c64319766d59ddfe95db1a7b2/URLSessionMockerSample/URLSessionMockerSampleTests/URLSessionMockerSampleTests.swift#L93).

## What's Next
Hope this article helped you get started and get a sense of how it will be useful for you. So the best thing to do next 
would be to write a simple test and try it out for yourself. You can use this sample project itself or the sample tests 
in the [Mocker github repository](https://github.com/WeTransfer/Mocker).

Enjoy mocking testing!