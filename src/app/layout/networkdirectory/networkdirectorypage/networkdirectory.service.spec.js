"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var networkdirectory_service_1 = require("./networkdirectory.service");
describe('NetworkDirectoryService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(networkdirectory_service_1.NetworkDirectoryService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=networkdirectory.service.spec.js.map