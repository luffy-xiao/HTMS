'use strict';

/* Filters */

angular.module('ms.site.filters', []).filter('togender', function () {
    return function (idcard) {
        if (idcard) {
            return idcard[idcard.length - 2] % 2 == 1 ? "男" : "女";
        }
        else {
            return "未知"
        }
    }
}).filter("usertype", function () {
    return function (typeId) {
        if (typeId == 1) {
            return "管理员"
        } else if (typeId == 2) {
            return "动迁操作员"
        } else if (typeId == 3) {
            return "安置操作员"
        } else {
            return "未知"
        }     
    }
}).filter("selectedname", function () {
    return function (residents) {
        var name =""
        $filter('filter')(residents, { selected: true }, true).forEach(function (r) {
            name += r + ","
        })
        return name
    }
})